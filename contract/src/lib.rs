#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Address, Env, String, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CarbonProject {
    pub id: u32,
    pub name: String,
    pub location: String,
    pub project_type: String, // e.g., "reforestation", "renewable_energy", "carbon_capture"
    pub description: String,
    pub issuer: Address,
    pub created_at: u64,
    pub total_credits_issued: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CarbonCredit {
    pub id: u128,
    pub project_id: u32,
    pub amount: i128,
    pub owner: Address,
    pub issued_at: u64,
    pub vintage: u32, // Year the credit was issued
    pub retired: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreditBatch {
    pub project_id: u32,
    pub amount: i128,
    pub vintage: u32,
    pub issued_at: u64,
}

#[contract]
pub struct CarbonCredits;

#[contractimpl]
impl CarbonCredits {
    /// Initialize the contract
    pub fn init(env: Env) {
        // Initialize project counter
        let project_counter_key = symbol_short!("proj_cnt");
        env.storage().persistent().set(&project_counter_key, &0u32);

        // Initialize credit counter
        let credit_counter_key = symbol_short!("cred_cnt");
        env.storage().persistent().set(&credit_counter_key, &0u128);
    }

    /// Register a new carbon offset project
    /// Returns the project_id that was assigned
    pub fn register_project(
        env: Env,
        issuer: Address,
        name: String,
        location: String,
        project_type: String,
        description: String,
    ) -> u32 {
        // Get and increment project counter
        let project_counter_key = symbol_short!("proj_cnt");
        let project_id: u32 = env
            .storage()
            .persistent()
            .get(&project_counter_key)
            .unwrap_or(0u32);
        let new_project_id = project_id + 1;
        env.storage()
            .persistent()
            .set(&project_counter_key, &new_project_id);

        // Create the project
        let project = CarbonProject {
            id: project_id,
            name: name.clone(),
            location: location.clone(),
            project_type: project_type.clone(),
            description: description.clone(),
            issuer,
            created_at: env.ledger().timestamp(),
            total_credits_issued: 0i128,
        };

        // Store the project
        let project_key = symbol_short!("project");
        let project_id_key = (project_key, project_id);
        env.storage().persistent().set(&project_id_key, &project);

        project_id
    }

    /// Issue carbon credits for a specific project
    /// Returns the credit batch information
    pub fn issue_credits(
        env: Env,
        issuer: Address,
        project_id: u32,
        amount: i128,
        vintage: u32,
        recipient: Address,
    ) -> CreditBatch {
        // Verify project exists
        let project_key = symbol_short!("project");
        let project_id_key = (project_key, project_id);
        let project: CarbonProject = env
            .storage()
            .persistent()
            .get(&project_id_key)
            .expect("Project does not exist");

        // Only the project issuer can issue credits
        if project.issuer != issuer {
            panic!("Only project issuer can issue credits");
        }

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Get and increment credit counter
        let credit_counter_key = symbol_short!("cred_cnt");
        let credit_id: u128 = env
            .storage()
            .persistent()
            .get(&credit_counter_key)
            .unwrap_or(0u128);

        // Update project total credits
        let mut updated_project = project.clone();
        updated_project.total_credits_issued += amount;
        env.storage()
            .persistent()
            .set(&project_id_key, &updated_project);

        // Create credit batch
        let batch = CreditBatch {
            project_id,
            amount,
            vintage,
            issued_at: env.ledger().timestamp(),
        };

        // Store credit information
        let credit_key = symbol_short!("credit");
        let credit_id_key = (credit_key, credit_id);
        let credit = CarbonCredit {
            id: credit_id,
            project_id,
            amount,
            owner: recipient.clone(),
            issued_at: env.ledger().timestamp(),
            vintage,
            retired: false,
        };
        env.storage().persistent().set(&credit_id_key, &credit);

        // Update recipient balance
        let balance_key = symbol_short!("balance");
        let recipient_balance_key = (balance_key, recipient.clone());
        let current_balance: i128 = env
            .storage()
            .persistent()
            .get(&recipient_balance_key)
            .unwrap_or(0i128);
        env.storage()
            .persistent()
            .set(&recipient_balance_key, &(current_balance + amount));

        // Track credits by recipient
        let credits_list_key = symbol_short!("credits");
        let recipient_credits_key = (credits_list_key, recipient.clone());
        let mut credit_ids: Vec<u128> = env
            .storage()
            .persistent()
            .get(&recipient_credits_key)
            .unwrap_or_else(|| vec![&env]);
        credit_ids.push_back(credit_id);
        env.storage()
            .persistent()
            .set(&recipient_credits_key, &credit_ids);

        // Increment credit counter
        env.storage()
            .persistent()
            .set(&credit_counter_key, &(credit_id + 1));

        batch
    }

    /// Transfer carbon credits from the invoker to another address
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Check sender balance
        let balance_key = symbol_short!("balance");
        let from_balance_key = (balance_key, from.clone());
        let from_balance: i128 = env
            .storage()
            .persistent()
            .get(&from_balance_key)
            .unwrap_or(0i128);

        if from_balance < amount {
            panic!("Insufficient balance");
        }

        // Update sender balance
        env.storage()
            .persistent()
            .set(&from_balance_key, &(from_balance - amount));

        // Update recipient balance
        let balance_key = symbol_short!("balance");
        let to_balance_key = (balance_key, to.clone());
        let to_balance: i128 = env
            .storage()
            .persistent()
            .get(&to_balance_key)
            .unwrap_or(0i128);
        env.storage()
            .persistent()
            .set(&to_balance_key, &(to_balance + amount));
    }

    /// Retire carbon credits (remove them from circulation to prevent double counting)
    pub fn retire(env: Env, owner: Address, amount: i128) -> i128 {
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Check balance
        let balance_key = symbol_short!("balance");
        let owner_balance_key = (balance_key, owner.clone());
        let balance: i128 = env
            .storage()
            .persistent()
            .get(&owner_balance_key)
            .unwrap_or(0i128);

        if balance < amount {
            panic!("Insufficient balance");
        }

        // Update balance
        env.storage()
            .persistent()
            .set(&owner_balance_key, &(balance - amount));

        // Update total retired
        let retired_key = symbol_short!("retired");
        let total_retired: i128 = env
            .storage()
            .persistent()
            .get(&retired_key)
            .unwrap_or(0i128);
        env.storage()
            .persistent()
            .set(&retired_key, &(total_retired + amount));

        total_retired + amount
    }

    /// Get the balance of an address
    pub fn balance(env: Env, address: Address) -> i128 {
        let balance_key = symbol_short!("balance");
        let address_balance_key = (balance_key, address);
        env.storage()
            .persistent()
            .get(&address_balance_key)
            .unwrap_or(0i128)
    }

    /// Get project details
    pub fn get_project(env: Env, project_id: u32) -> CarbonProject {
        let project_key = symbol_short!("project");
        let project_id_key = (project_key, project_id);
        env.storage()
            .persistent()
            .get(&project_id_key)
            .expect("Project does not exist")
    }

    /// Get all projects
    pub fn get_all_projects(env: Env) -> Vec<CarbonProject> {
        let project_counter_key = symbol_short!("proj_cnt");
        let total_projects: u32 = env
            .storage()
            .persistent()
            .get(&project_counter_key)
            .unwrap_or(0u32);

        let mut projects = vec![&env];

        for i in 0..total_projects {
            let project_key = symbol_short!("project");
            let project_id_key = (project_key, i);
            if let Some(project) = env.storage().persistent().get(&project_id_key) {
                projects.push_back(project);
            }
        }

        projects
    }

    /// Get total retired credits
    pub fn total_retired(env: Env) -> i128 {
        let retired_key = symbol_short!("retired");
        env.storage()
            .persistent()
            .get(&retired_key)
            .unwrap_or(0i128)
    }

    /// Get credits owned by an address
    pub fn get_credits(env: Env, address: Address) -> Vec<CarbonCredit> {
        let credits_list_key = symbol_short!("credits");
        let address_credits_key = (credits_list_key, address.clone());
        let credit_ids: Vec<u128> = env
            .storage()
            .persistent()
            .get(&address_credits_key)
            .unwrap_or_else(|| vec![&env]);

        let mut credits = vec![&env];

        for i in 0..credit_ids.len() {
            if let Some(credit_id) = credit_ids.get(i) {
                let credit_key = symbol_short!("credit");
                let credit_id_key = (credit_key, credit_id);
                if let Some(credit) = env.storage().persistent().get(&credit_id_key) {
                    credits.push_back(credit);
                }
            }
        }

        credits
    }
}
