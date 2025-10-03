export type OsemeGroup = {
  "version": "0.1.0",
  "name": "oseme_group",
  "instructions": [
    {
      "name": "initPlatform",
      "accounts": [
        {
          "name": "platformConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "config",
          "type": {
            "defined": "PlatformConfig"
          }
        }
      ]
    },
    {
      "name": "createGroup",
      "accounts": [
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "member",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "platformConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "model",
          "type": {
            "defined": "GroupModel"
          }
        },
        {
          "name": "cycleDays",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "memberCap",
          "type": {
            "option": "u8"
          }
        },
        {
          "name": "payoutOrder",
          "type": {
            "option": {
              "vec": "publicKey"
            }
          }
        }
      ]
    },
    {
      "name": "joinGroup",
      "accounts": [
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "member",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "contribute",
      "accounts": [
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "member",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contributor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "contributorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releasePayout",
      "accounts": [
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "platformConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          },
          {
            "name": "trustSubscriptionPrice",
            "type": "u64"
          },
          {
            "name": "superTrustSubscriptionPrice",
            "type": "u64"
          },
          {
            "name": "basicGroupLimit",
            "type": "u8"
          },
          {
            "name": "basicPerCreatorLimit",
            "type": "u8"
          },
          {
            "name": "gracePeriodDays",
            "type": "u8"
          },
          {
            "name": "trustPenalty",
            "type": "i8"
          },
          {
            "name": "trustBonus",
            "type": "i8"
          },
          {
            "name": "stakeBonusBps",
            "type": "u16"
          },
          {
            "name": "kycThreshold",
            "type": "u64"
          },
          {
            "name": "bonusPool",
            "type": "u64"
          },
          {
            "name": "usdcMint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "group",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "groupId",
            "type": "u64"
          },
          {
            "name": "model",
            "type": {
              "defined": "GroupModel"
            }
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "memberCap",
            "type": "u8"
          },
          {
            "name": "currentTurnIndex",
            "type": "u8"
          },
          {
            "name": "cycleDays",
            "type": "u32"
          },
          {
            "name": "payoutOrder",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "escrowVault",
            "type": "publicKey"
          },
          {
            "name": "stakeVault",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": "GroupStatus"
            }
          },
          {
            "name": "totalMembers",
            "type": "u8"
          },
          {
            "name": "currentTurnStart",
            "type": "i64"
          },
          {
            "name": "contributionAmount",
            "type": "u64"
          },
          {
            "name": "totalPool",
            "type": "u64"
          },
          {
            "name": "trustScore",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "member",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "group",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "contributedTurns",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "missedCount",
            "type": "u8"
          },
          {
            "name": "trustDelta",
            "type": "i8"
          },
          {
            "name": "joinTimestamp",
            "type": "i64"
          },
          {
            "name": "isCreator",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "escrowVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "group",
            "type": "publicKey"
          },
          {
            "name": "vaultAuthority",
            "type": "publicKey"
          },
          {
            "name": "currentBalance",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GroupModel",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Basic"
          },
          {
            "name": "Trust"
          },
          {
            "name": "SuperTrust"
          }
        ]
      }
    },
    {
      "name": "GroupStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Paused"
          },
          {
            "name": "Completed"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "GroupCreated",
      "fields": [
        {
          "name": "groupId",
          "type": "u64",
          "index": false
        },
        {
          "name": "creator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "model",
          "type": {
            "defined": "GroupModel"
          },
          "index": false
        }
      ]
    },
    {
      "name": "MemberJoined",
      "fields": [
        {
          "name": "groupId",
          "type": "u64",
          "index": false
        },
        {
          "name": "member",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ContributionMade",
      "fields": [
        {
          "name": "groupId",
          "type": "u64",
          "index": false
        },
        {
          "name": "contributor",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PayoutReleased",
      "fields": [
        {
          "name": "groupId",
          "type": "u64",
          "index": false
        },
        {
          "name": "recipient",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6001,
      "name": "GroupFull",
      "msg": "Group has reached maximum capacity"
    },
    {
      "code": 6002,
      "name": "AlreadyMember",
      "msg": "User is already a member of this group"
    },
    {
      "code": 6003,
      "name": "InvalidAmount",
      "msg": "Invalid contribution amount"
    },
    {
      "code": 6004,
      "name": "GroupNotActive",
      "msg": "Group is not in active status"
    },
    {
      "code": 6005,
      "name": "NotYourTurn",
      "msg": "Not your turn to receive payout"
    },
    {
      "code": 6006,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds for contribution"
    }
  ]
};

export const IDL: OsemeGroup = {
  "version": "0.1.0",
  "name": "oseme_group",
  "instructions": [
    {
      "name": "initPlatform",
      "accounts": [
        {
          "name": "platformConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "config",
          "type": {
            "defined": "PlatformConfig"
          }
        }
      ]
    },
    {
      "name": "createGroup",
      "accounts": [
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "member",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "platformConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "model",
          "type": {
            "defined": "GroupModel"
          }
        },
        {
          "name": "cycleDays",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "memberCap",
          "type": {
            "option": "u8"
          }
        },
        {
          "name": "payoutOrder",
          "type": {
            "option": {
              "vec": "publicKey"
            }
          }
        }
      ]
    },
    {
      "name": "joinGroup",
      "accounts": [
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "member",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "contribute",
      "accounts": [
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "member",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contributor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "contributorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releasePayout",
      "accounts": [
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "platformConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          },
          {
            "name": "trustSubscriptionPrice",
            "type": "u64"
          },
          {
            "name": "superTrustSubscriptionPrice",
            "type": "u64"
          },
          {
            "name": "basicGroupLimit",
            "type": "u8"
          },
          {
            "name": "basicPerCreatorLimit",
            "type": "u8"
          },
          {
            "name": "gracePeriodDays",
            "type": "u8"
          },
          {
            "name": "trustPenalty",
            "type": "i8"
          },
          {
            "name": "trustBonus",
            "type": "i8"
          },
          {
            "name": "stakeBonusBps",
            "type": "u16"
          },
          {
            "name": "kycThreshold",
            "type": "u64"
          },
          {
            "name": "bonusPool",
            "type": "u64"
          },
          {
            "name": "usdcMint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "group",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "groupId",
            "type": "u64"
          },
          {
            "name": "model",
            "type": {
              "defined": "GroupModel"
            }
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "memberCap",
            "type": "u8"
          },
          {
            "name": "currentTurnIndex",
            "type": "u8"
          },
          {
            "name": "cycleDays",
            "type": "u32"
          },
          {
            "name": "payoutOrder",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "escrowVault",
            "type": "publicKey"
          },
          {
            "name": "stakeVault",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": "GroupStatus"
            }
          },
          {
            "name": "totalMembers",
            "type": "u8"
          },
          {
            "name": "currentTurnStart",
            "type": "i64"
          },
          {
            "name": "contributionAmount",
            "type": "u64"
          },
          {
            "name": "totalPool",
            "type": "u64"
          },
          {
            "name": "trustScore",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "member",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "group",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "contributedTurns",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "missedCount",
            "type": "u8"
          },
          {
            "name": "trustDelta",
            "type": "i8"
          },
          {
            "name": "joinTimestamp",
            "type": "i64"
          },
          {
            "name": "isCreator",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "escrowVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "group",
            "type": "publicKey"
          },
          {
            "name": "vaultAuthority",
            "type": "publicKey"
          },
          {
            "name": "currentBalance",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GroupModel",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Basic"
          },
          {
            "name": "Trust"
          },
          {
            "name": "SuperTrust"
          }
        ]
      }
    },
    {
      "name": "GroupStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Paused"
          },
          {
            "name": "Completed"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "GroupCreated",
      "fields": [
        {
          "name": "groupId",
          "type": "u64",
          "index": false
        },
        {
          "name": "creator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "model",
          "type": {
            "defined": "GroupModel"
          },
          "index": false
        }
      ]
    },
    {
      "name": "MemberJoined",
      "fields": [
        {
          "name": "groupId",
          "type": "u64",
          "index": false
        },
        {
          "name": "member",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ContributionMade",
      "fields": [
        {
          "name": "groupId",
          "type": "u64",
          "index": false
        },
        {
          "name": "contributor",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PayoutReleased",
      "fields": [
        {
          "name": "groupId",
          "type": "u64",
          "index": false
        },
        {
          "name": "recipient",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6001,
      "name": "GroupFull",
      "msg": "Group has reached maximum capacity"
    },
    {
      "code": 6002,
      "name": "AlreadyMember",
      "msg": "User is already a member of this group"
    },
    {
      "code": 6003,
      "name": "InvalidAmount",
      "msg": "Invalid contribution amount"
    },
    {
      "code": 6004,
      "name": "GroupNotActive",
      "msg": "Group is not in active status"
    },
    {
      "code": 6005,
      "name": "NotYourTurn",
      "msg": "Not your turn to receive payout"
    },
    {
      "code": 6006,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds for contribution"
    }
  ]
};