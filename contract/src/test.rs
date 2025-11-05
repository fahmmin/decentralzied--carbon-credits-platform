#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{symbol_short, testutils::Address as _, Address, Env, String as SorobanString};

#[test]
fn test_register_and_get_project() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CarbonCredits);
    let client = CarbonCreditsClient::new(&env, &contract_id);

    // Initialize
    client.init();

    let issuer = Address::generate(&env);
    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &issuer,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    let name = SorobanString::from_str(&env, "Forest Restoration Project");
    let location = SorobanString::from_str(&env, "Amazon Rainforest, Brazil");
    let project_type = SorobanString::from_str(&env, "reforestation");
    let description = SorobanString::from_str(&env, "A project to restore degraded forest areas");

    // Register a project
    let project_id =
        client.register_project(&issuer, &name, &location, &project_type, &description);
    assert_eq!(project_id, 0u32);

    // Get project details
    let project = client.get_project(&project_id);
    assert_eq!(project.id, 0u32);
    assert_eq!(project.name, name);
    assert_eq!(project.location, location);
    assert_eq!(project.project_type, project_type);
    assert_eq!(project.description, description);
}

#[test]
fn test_issue_credits() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CarbonCredits);
    let client = CarbonCreditsClient::new(&env, &contract_id);

    // Initialize
    client.init();

    let issuer = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Register a project
    let name = SorobanString::from_str(&env, "Solar Energy Project");
    let location = SorobanString::from_str(&env, "California, USA");
    let project_type = SorobanString::from_str(&env, "renewable_energy");
    let description = SorobanString::from_str(&env, "Solar panel installation");

    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &issuer,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    let project_id = client.register_project(&name, &location, &project_type, &description);

    // Issue credits
    let amount = 1000i128;
    let vintage = 2024u32;
    let batch = client.issue_credits(&issuer, &project_id, &amount, &vintage, &recipient);

    assert_eq!(batch.project_id, project_id);
    assert_eq!(batch.amount, amount);
    assert_eq!(batch.vintage, vintage);

    // Check recipient balance
    let balance = client.balance(&recipient);
    assert_eq!(balance, amount);

    // Check project total credits
    let project = client.get_project(&project_id);
    assert_eq!(project.total_credits_issued, amount);
}

#[test]
fn test_transfer_credits() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CarbonCredits);
    let client = CarbonCreditsClient::new(&env, &contract_id);

    // Initialize
    client.init();

    let issuer = Address::generate(&env);
    let recipient = Address::generate(&env);
    let buyer = Address::generate(&env);

    // Register a project and issue credits
    let name = SorobanString::from_str(&env, "Wind Farm Project");
    let location = SorobanString::from_str(&env, "Texas, USA");
    let project_type = SorobanString::from_str(&env, "renewable_energy");
    let description = SorobanString::from_str(&env, "Wind turbine installation");

    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &issuer,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    let project_id =
        client.register_project(&issuer, &name, &location, &project_type, &description);
    let amount = 5000i128;
    let vintage = 2024u32;
    client.issue_credits(&issuer, &project_id, &amount, &vintage, &recipient);

    // Transfer credits from recipient to buyer
    let transfer_amount = 2000i128;
    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &recipient,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    client.transfer(&recipient, &buyer, &transfer_amount);

    // Check balances
    let recipient_balance = client.balance(&recipient);
    assert_eq!(recipient_balance, amount - transfer_amount);

    let buyer_balance = client.balance(&buyer);
    assert_eq!(buyer_balance, transfer_amount);
}

#[test]
fn test_retire_credits() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CarbonCredits);
    let client = CarbonCreditsClient::new(&env, &contract_id);

    // Initialize
    client.init();

    let issuer = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Register a project and issue credits
    let name = SorobanString::from_str(&env, "Carbon Capture Project");
    let location = SorobanString::from_str(&env, "Norway");
    let project_type = SorobanString::from_str(&env, "carbon_capture");
    let description = SorobanString::from_str(&env, "Direct air capture technology");

    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &issuer,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    let project_id =
        client.register_project(&issuer, &name, &location, &project_type, &description);
    let amount = 3000i128;
    let vintage = 2024u32;
    client.issue_credits(&issuer, &project_id, &amount, &vintage, &recipient);

    // Retire credits
    let retire_amount = 1500i128;
    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &recipient,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    let total_retired = client.retire(&recipient, &retire_amount);
    assert_eq!(total_retired, retire_amount);

    // Check recipient balance decreased
    let balance = client.balance(&recipient);
    assert_eq!(balance, amount - retire_amount);

    // Check total retired
    let total_retired_check = client.total_retired();
    assert_eq!(total_retired_check, retire_amount);
}

#[test]
#[should_panic(expected = "Insufficient balance")]
fn test_transfer_insufficient_balance() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CarbonCredits);
    let client = CarbonCreditsClient::new(&env, &contract_id);

    // Initialize
    client.init();

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);

    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &sender,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    // Try to transfer more than balance
    client.transfer(&sender, &recipient, &1000i128);
}

#[test]
#[should_panic(expected = "Only project issuer can issue credits")]
fn test_issue_credits_unauthorized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CarbonCredits);
    let client = CarbonCreditsClient::new(&env, &contract_id);

    // Initialize
    client.init();

    let issuer = Address::generate(&env);
    let unauthorized = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Register a project
    let name = SorobanString::from_str(&env, "Test Project");
    let location = SorobanString::from_str(&env, "Test Location");
    let project_type = SorobanString::from_str(&env, "reforestation");
    let description = SorobanString::from_str(&env, "Test description");

    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &issuer,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    let project_id =
        client.register_project(&issuer, &name, &location, &project_type, &description);

    // Try to issue credits as unauthorized user
    env.mock_all_auths(&[soroban_sdk::testutils::Auth {
        address: &unauthorized,
        invoke: &soroban_sdk::testutils::InvokeContract::Contract(contract_id.clone()),
    }]);

    client.issue_credits(&unauthorized, &project_id, &1000i128, &2024u32, &recipient);
}
