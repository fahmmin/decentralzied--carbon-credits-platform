import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBNTTKV2AEWOAGAKEDYL43PQZRPDTXUQO52WDOEQDWS5L2NMEUDSKKLW",
  }
} as const


export interface CarbonProject {
  created_at: u64;
  description: string;
  id: u32;
  issuer: string;
  location: string;
  name: string;
  project_type: string;
  total_credits_issued: i128;
}


export interface CarbonCredit {
  amount: i128;
  id: u128;
  issued_at: u64;
  owner: string;
  project_id: u32;
  retired: boolean;
  vintage: u32;
}


export interface CreditBatch {
  amount: i128;
  issued_at: u64;
  project_id: u32;
  vintage: u32;
}

export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract
   */
  init: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a register_project transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Register a new carbon offset project
   * Returns the project_id that was assigned
   */
  register_project: ({issuer, name, location, project_type, description}: {issuer: string, name: string, location: string, project_type: string, description: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a issue_credits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Issue carbon credits for a specific project
   * Returns the credit batch information
   */
  issue_credits: ({issuer, project_id, amount, vintage, recipient}: {issuer: string, project_id: u32, amount: i128, vintage: u32, recipient: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<CreditBatch>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfer carbon credits from the invoker to another address
   */
  transfer: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a retire transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Retire carbon credits (remove them from circulation to prevent double counting)
   */
  retire: ({owner, amount}: {owner: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the balance of an address
   */
  balance: ({address}: {address: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_project transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get project details
   */
  get_project: ({project_id}: {project_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<CarbonProject>>

  /**
   * Construct and simulate a get_all_projects transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all projects
   */
  get_all_projects: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<CarbonProject>>>

  /**
   * Construct and simulate a total_retired transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get total retired credits
   */
  total_retired: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_credits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get credits owned by an address
   */
  get_credits: ({address}: {address: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<CarbonCredit>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAADUNhcmJvblByb2plY3QAAAAAAAAIAAAAAAAAAApjcmVhdGVkX2F0AAAAAAAGAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAJpZAAAAAAABAAAAAAAAAAGaXNzdWVyAAAAAAATAAAAAAAAAAhsb2NhdGlvbgAAABAAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAxwcm9qZWN0X3R5cGUAAAAQAAAAAAAAABR0b3RhbF9jcmVkaXRzX2lzc3VlZAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAADENhcmJvbkNyZWRpdAAAAAcAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAACaWQAAAAAAAoAAAAAAAAACWlzc3VlZF9hdAAAAAAAAAYAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAKcHJvamVjdF9pZAAAAAAABAAAAAAAAAAHcmV0aXJlZAAAAAABAAAAAAAAAAd2aW50YWdlAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAC0NyZWRpdEJhdGNoAAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAJaXNzdWVkX2F0AAAAAAAABgAAAAAAAAAKcHJvamVjdF9pZAAAAAAABAAAAAAAAAAHdmludGFnZQAAAAAE",
        "AAAAAAAAABdJbml0aWFsaXplIHRoZSBjb250cmFjdAAAAAAEaW5pdAAAAAAAAAAA",
        "AAAAAAAAAE1SZWdpc3RlciBhIG5ldyBjYXJib24gb2Zmc2V0IHByb2plY3QKUmV0dXJucyB0aGUgcHJvamVjdF9pZCB0aGF0IHdhcyBhc3NpZ25lZAAAAAAAABByZWdpc3Rlcl9wcm9qZWN0AAAABQAAAAAAAAAGaXNzdWVyAAAAAAATAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAIbG9jYXRpb24AAAAQAAAAAAAAAAxwcm9qZWN0X3R5cGUAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAQAAAAQ=",
        "AAAAAAAAAFBJc3N1ZSBjYXJib24gY3JlZGl0cyBmb3IgYSBzcGVjaWZpYyBwcm9qZWN0ClJldHVybnMgdGhlIGNyZWRpdCBiYXRjaCBpbmZvcm1hdGlvbgAAAA1pc3N1ZV9jcmVkaXRzAAAAAAAABQAAAAAAAAAGaXNzdWVyAAAAAAATAAAAAAAAAApwcm9qZWN0X2lkAAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAB3ZpbnRhZ2UAAAAABAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAEAAAfQAAAAC0NyZWRpdEJhdGNoAA==",
        "AAAAAAAAADtUcmFuc2ZlciBjYXJib24gY3JlZGl0cyBmcm9tIHRoZSBpbnZva2VyIHRvIGFub3RoZXIgYWRkcmVzcwAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAE9SZXRpcmUgY2FyYm9uIGNyZWRpdHMgKHJlbW92ZSB0aGVtIGZyb20gY2lyY3VsYXRpb24gdG8gcHJldmVudCBkb3VibGUgY291bnRpbmcpAAAAAAZyZXRpcmUAAAAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAAAs=",
        "AAAAAAAAAB1HZXQgdGhlIGJhbGFuY2Ugb2YgYW4gYWRkcmVzcwAAAAAAAAdiYWxhbmNlAAAAAAEAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAEAAAAL",
        "AAAAAAAAABNHZXQgcHJvamVjdCBkZXRhaWxzAAAAAAtnZXRfcHJvamVjdAAAAAABAAAAAAAAAApwcm9qZWN0X2lkAAAAAAAEAAAAAQAAB9AAAAANQ2FyYm9uUHJvamVjdAAAAA==",
        "AAAAAAAAABBHZXQgYWxsIHByb2plY3RzAAAAEGdldF9hbGxfcHJvamVjdHMAAAAAAAAAAQAAA+oAAAfQAAAADUNhcmJvblByb2plY3QAAAA=",
        "AAAAAAAAABlHZXQgdG90YWwgcmV0aXJlZCBjcmVkaXRzAAAAAAAADXRvdGFsX3JldGlyZWQAAAAAAAAAAAAAAQAAAAs=",
        "AAAAAAAAAB9HZXQgY3JlZGl0cyBvd25lZCBieSBhbiBhZGRyZXNzAAAAAAtnZXRfY3JlZGl0cwAAAAABAAAAAAAAAAdhZGRyZXNzAAAAABMAAAABAAAD6gAAB9AAAAAMQ2FyYm9uQ3JlZGl0" ]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
        register_project: this.txFromJSON<u32>,
        issue_credits: this.txFromJSON<CreditBatch>,
        transfer: this.txFromJSON<null>,
        retire: this.txFromJSON<i128>,
        balance: this.txFromJSON<i128>,
        get_project: this.txFromJSON<CarbonProject>,
        get_all_projects: this.txFromJSON<Array<CarbonProject>>,
        total_retired: this.txFromJSON<i128>,
        get_credits: this.txFromJSON<Array<CarbonCredit>>
  }
}