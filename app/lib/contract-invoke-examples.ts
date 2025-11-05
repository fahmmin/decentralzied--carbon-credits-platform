/**
 * Example usage of contract invoke functions
 * 
 * These examples demonstrate how to use the invoke functions
 * similar to the Stellar CLI format:
 * 
 * stellar contract invoke \
 *   --id CCH2G7C7NOOQK6WFE5XFL56TBCZTWAIIWMTVH7ADIXCUPH7OFEW46K32 \
 *   --source-account alice \
 *   --network testnet \
 *   -- \
 *   claim_nft \
 *   --recipient GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ \
 *   --nft1_image_uri "https://example.com/nft1.png" \
 *   --nft2_image_uri "https://example.com/nft2.png"
 */

import {
    invokeClaimNft,
    invokeInit,
    invokeStoreItem,
    invokeGetItems,
    invokeDeleteItem,
    invokeContract
} from './contract-invoke';
import { kit } from '../app/components/wallet-connect';

/**
 * Example: Invoke claim_nft function
 */
export async function exampleClaimNft() {
    const contractId = 'CCH2G7C7NOOQK6WFE5XFL56TBCZTWAIIWMTVH7ADIXCUPH7OFEW46K32';
    const sourceAccount = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ'; // Replace with actual account

    try {
        // Invoke claim_nft
        const tx = await invokeClaimNft({
            id: contractId,
            sourceAccount: sourceAccount,
            network: 'testnet',
            signTransaction: (tx) => kit.signTransaction(tx),
            recipient: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ',
            nft1_image_uri: 'https://example.com/nft1.png',
            nft2_image_uri: 'https://example.com/nft2.png',
        });

        // Sign and send the transaction
        const result = await tx.signAndSend();
        console.log('Claim NFT result:', result);
        return result;
    } catch (error) {
        console.error('Error claiming NFT:', error);
        throw error;
    }
}

/**
 * Example: Invoke init function
 */
export async function exampleInit() {
    const contractId = 'CCH2G7C7NOOQK6WFE5XFL56TBCZTWAIIWMTVH7ADIXCUPH7OFEW46K32';
    const sourceAccount = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ'; // Replace with actual account

    try {
        const tx = await invokeInit({
            id: contractId,
            sourceAccount: sourceAccount,
            network: 'testnet',
            signTransaction: (tx) => kit.signTransaction(tx),
        });

        const result = await tx.signAndSend();
        console.log('Init result:', result);
        return result;
    } catch (error) {
        console.error('Error initializing contract:', error);
        throw error;
    }
}

/**
 * Example: Invoke store_item function
 */
export async function exampleStoreItem() {
    const contractId = 'CCH2G7C7NOOQK6WFE5XFL56TBCZTWAIIWMTVH7ADIXCUPH7OFEW46K32';
    const sourceAccount = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ'; // Replace with actual account

    try {
        const tx = await invokeStoreItem({
            id: contractId,
            sourceAccount: sourceAccount,
            network: 'testnet',
            signTransaction: (tx) => kit.signTransaction(tx),
            project_id: 1,
            title: 'My Project Item',
            description: 'This is a test item',
            status: 'active',
        });

        const result = await tx.signAndSend();
        console.log('Store item result:', result);
        return result;
    } catch (error) {
        console.error('Error storing item:', error);
        throw error;
    }
}

/**
 * Example: Invoke get_items function (read-only)
 */
export async function exampleGetItems() {
    const contractId = 'CCH2G7C7NOOQK6WFE5XFL56TBCZTWAIIWMTVH7ADIXCUPH7OFEW46K32';
    const sourceAccount = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ'; // Replace with actual account

    try {
        const tx = await invokeGetItems({
            id: contractId,
            sourceAccount: sourceAccount,
            network: 'testnet',
            signTransaction: (tx) => kit.signTransaction(tx),
            project_id: 1,
        });

        // For read-only operations, you might just want to simulate
        // or call the result directly without signing
        const result = await tx.simulate();
        console.log('Get items result:', result);
        return result;
    } catch (error) {
        console.error('Error getting items:', error);
        throw error;
    }
}

/**
 * Example: Invoke delete_item function
 */
export async function exampleDeleteItem() {
    const contractId = 'CCH2G7C7NOOQK6WFE5XFL56TBCZTWAIIWMTVH7ADIXCUPH7OFEW46K32';
    const sourceAccount = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ'; // Replace with actual account

    try {
        const tx = await invokeDeleteItem({
            id: contractId,
            sourceAccount: sourceAccount,
            network: 'testnet',
            signTransaction: (tx) => kit.signTransaction(tx),
            project_id: 1,
            item_id: 0,
        });

        const result = await tx.signAndSend();
        console.log('Delete item result:', result);
        return result;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
}

/**
 * Example: Generic invoke using invokeContract
 * This matches the CLI format more closely for dynamic function calls
 */
export async function exampleGenericInvoke() {
    const contractId = 'CCH2G7C7NOOQK6WFE5XFL56TBCZTWAIIWMTVH7ADIXCUPH7OFEW46K32';
    const sourceAccount = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ'; // Replace with actual account

    try {
        // This is equivalent to:
        // stellar contract invoke --id <id> --source-account <account> --network testnet -- claim_nft --recipient <recipient> --nft1_image_uri <uri> --nft2_image_uri <uri>
        const tx = await invokeContract({
            id: contractId,
            sourceAccount: sourceAccount,
            network: 'testnet',
            signTransaction: (tx) => kit.signTransaction(tx),
            functionName: 'claim_nft',
            args: {
                recipient: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ',
                nft1_image_uri: 'https://example.com/nft1.png',
                nft2_image_uri: 'https://example.com/nft2.png',
            },
        });

        const result = await tx.signAndSend();
        console.log('Generic invoke result:', result);
        return result;
    } catch (error) {
        console.error('Error in generic invoke:', error);
        throw error;
    }
}

