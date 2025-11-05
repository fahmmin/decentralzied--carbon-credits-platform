import { Address } from '@stellar/stellar-sdk';
import { Client, networks, AssembledTransaction } from '@/index';

export type Network = 'testnet' | 'mainnet';

export interface InvokeOptions {
    /** Contract ID */
    id: string;
    /** Source account (public key) */
    sourceAccount: string;
    /** Network to use */
    network: Network;
    /** Optional RPC URL override */
    rpcUrl?: string;
    /** Sign transaction function */
    signTransaction: (tx: any) => Promise<any>;
}

/**
 * Create a contract client for invoking contract methods
 */
function createInvokeClient(
    options: InvokeOptions
): Client {
    const networkConfig = networks[options.network];
    const rpcUrl = options.rpcUrl || (options.network === 'testnet'
        ? 'https://soroban-testnet.stellar.org'
        : 'https://soroban-mainnet.stellar.org');

    return new Client({
        rpcUrl,
        networkPassphrase: networkConfig.networkPassphrase,
        contractId: options.id,
        publicKey: options.sourceAccount,
        signTransaction: options.signTransaction,
    });
}

/**
 * Generic invoke function that matches the Stellar CLI format more closely
 * This allows you to invoke any contract method dynamically
 */
export async function invokeContract(
    options: InvokeOptions & {
        functionName: string;
        args: Record<string, any>;
    }
): Promise<AssembledTransaction<any>> {
    const client = createInvokeClient(options);

    try {
        // Type assertion needed for dynamic function calls
        const func = (client as any)[options.functionName];
        if (!func || typeof func !== 'function') {
            throw new Error(`Function ${options.functionName} not found on client`);
        }

        const tx = await func(options.args);
        return tx;
    } catch (error) {
        throw new Error(`Failed to invoke ${options.functionName}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Invoke claim_nft function
 * Note: This function uses the generic invokeContract approach since claim_nft
 * may not be in the current contract interface. Make sure your contract has this method.
 * 
 * Equivalent to: stellar contract invoke --id <id> --source-account <account> --network testnet -- claim_nft --recipient <recipient> --nft1_image_uri <uri> --nft2_image_uri <uri>
 */
export async function invokeClaimNft(
    options: InvokeOptions & {
        recipient: string;
        nft1_image_uri: string;
        nft2_image_uri: string;
    }
): Promise<AssembledTransaction<any>> {
    try {
        // Use generic invoke since claim_nft might not be in the typed Client interface yet
        return await invokeContract({
            ...options,
            functionName: 'claim_nft',
            args: {
                recipient: Address.fromString(options.recipient),
                nft1_image_uri: options.nft1_image_uri,
                nft2_image_uri: options.nft2_image_uri,
            },
        });
    } catch (error) {
        throw new Error(`Failed to invoke claim_nft: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Invoke init function
 * Equivalent to: stellar contract invoke --id <id> --source-account <account> --network testnet -- init
 */
export async function invokeInit(
    options: InvokeOptions
): Promise<AssembledTransaction<null>> {
    const client = createInvokeClient(options);

    try {
        const tx = await client.init();
        return tx;
    } catch (error) {
        throw new Error(`Failed to invoke init: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Invoke store_item function
 * Equivalent to: stellar contract invoke --id <id> --source-account <account> --network testnet -- store_item --project_id <id> --title <title> --description <desc> --status <status>
 */
export async function invokeStoreItem(
    options: InvokeOptions & {
        project_id: number;
        title: string;
        description: string;
        status: string;
    }
): Promise<AssembledTransaction<number>> {
    const client = createInvokeClient(options);

    try {
        const tx = await client.store_item({
            project_id: options.project_id,
            title: options.title,
            description: options.description,
            status: options.status,
        });

        return tx;
    } catch (error) {
        throw new Error(`Failed to invoke store_item: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Invoke get_items function (read-only, doesn't require signing)
 * Equivalent to: stellar contract invoke --id <id> --source-account <account> --network testnet -- get_items --project_id <id>
 */
export async function invokeGetItems(
    options: InvokeOptions & {
        project_id: number;
    }
): Promise<AssembledTransaction<any[]>> {
    const client = createInvokeClient(options);

    try {
        const tx = await client.get_items({
            project_id: options.project_id,
        });

        return tx;
    } catch (error) {
        throw new Error(`Failed to invoke get_items: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Invoke delete_item function
 * Equivalent to: stellar contract invoke --id <id> --source-account <account> --network testnet -- delete_item --project_id <id> --item_id <id>
 */
export async function invokeDeleteItem(
    options: InvokeOptions & {
        project_id: number;
        item_id: number;
    }
): Promise<AssembledTransaction<null>> {
    const client = createInvokeClient(options);

    try {
        const tx = await client.delete_item({
            project_id: options.project_id,
            item_id: options.item_id,
        });

        return tx;
    } catch (error) {
        throw new Error(`Failed to invoke delete_item: ${error instanceof Error ? error.message : String(error)}`);
    }
}

