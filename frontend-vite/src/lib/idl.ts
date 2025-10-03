// IDL type definitions for oseme_group program
export type OsemeGroupIdl = {
  version: string
  name: string
  instructions: any[]
  accounts: any[]
  types: any[]
  events: any[]
  errors: any[]
  metadata: {
    address: string
  }
}

// Import the IDL as JSON and cast to our type
const IDL: OsemeGroupIdl = {
  "version": "0.1.0",
  "name": "oseme_group",
  "instructions": [
    {
      "name": "initPlatform",
      "accounts": [
        { "name": "platformConfig", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "config", "type": { "defined": "PlatformConfig" } }]
    },
    {
      "name": "createGroup",
      "accounts": [
        { "name": "group", "isMut": true, "isSigner": false },
        { "name": "creator", "isMut": true, "isSigner": true },
        { "name": "escrowVault", "isMut": true, "isSigner": false },
        { "name": "platformConfig", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "model", "type": { "defined": "GroupModel" } },
        { "name": "cycleDays", "type": { "option": "u32" } },
        { "name": "memberCap", "type": { "option": "u8" } },
        { "name": "contributionAmount", "type": "u64" }
      ]
    }
  ],
  "accounts": [],
  "types": [],
  "events": [],
  "errors": [],
  "metadata": {
    "address": "GrpABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef"
  }
}

export default IDL