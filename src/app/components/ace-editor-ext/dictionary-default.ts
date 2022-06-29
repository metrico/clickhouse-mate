export interface Dictionary {
    name: string;
    icon: number;
    type?: string;
    doc_link?: string;
    description?: string;
}
export const DictionaryDefault: Dictionary[] = [
    {
        name: "SELECT",
        doc_link: "select/",
        icon: 0
    },
    {
        name: "ALL",
        doc_link: "select/all",
        icon: 0
    },
    {
        name: "ARRAY JOIN",
        doc_link: "select/array-join",
        icon: 0
    },
    {
        name: "DISTINCT",
        doc_link: "select/distinct",
        icon: 0
    },
    {
        name: "EXCEPT",
        doc_link: "select/except",
        icon: 0
    },
    {
        name: "FORMAT",
        doc_link: "select/format",
        icon: 0
    },
    {
        name: "FROM",
        doc_link: "select/from",
        icon: 0
    },
    {
        name: "GROUP BY",
        doc_link: "select/group-by",
        icon: 0
    },
    {
        name: "HAVING",
        doc_link: "select/having",
        icon: 0
    },
    {
        name: "INTERSECT",
        doc_link: "select/intersect",
        icon: 0
    },
    {
        name: "INTO OUTFILE",
        doc_link: "select/into-outfile",
        icon: 0
    },
    {
        name: "JOIN",
        doc_link: "select/join",
        icon: 0
    },
    {
        name: "LIMIT BY",
        doc_link: "select/limit-by",
        icon: 0
    },
    {
        name: "LIMIT",
        doc_link: "select/limit",
        icon: 0
    },
    {
        name: "OFFSET",
        doc_link: "select/offset",
        icon: 0
    },
    {
        name: "ORDER BY",
        doc_link: "select/order-by",
        icon: 0
    },
    {
        name: "PREWHERE",
        doc_link: "select/prewhere",
        icon: 0
    },
    {
        name: "SAMPLE",
        doc_link: "select/sample",
        icon: 0
    },
    {
        name: "UNION",
        doc_link: "select/union",
        icon: 0
    },
    {
        name: "WHERE",
        doc_link: "select/where",
        icon: 0
    },
    {
        name: "WITH",
        doc_link: "select/with",
        icon: 0
    },
    {
        name: "INSERT INTO",
        doc_link: "insert-into",
        icon: 0
    },
    {
        name: "CREATE",
        doc_link: "create/",
        icon: 0
    },
    {
        name: "DATABASE",
        doc_link: "create/database",
        icon: 0
    },
    {
        name: "TABLE",
        doc_link: "create/table",
        icon: 0
    },
    {
        name: "VIEW",
        doc_link: "create/view",
        icon: 0
    },
    {
        name: "DICTIONARY",
        doc_link: "create/dictionary",
        icon: 0
    },
    {
        name: "FUNCTION",
        doc_link: "create/function",
        icon: 0
    },
    {
        name: "USER",
        doc_link: "create/user",
        icon: 0
    },
    {
        name: "ROLE",
        doc_link: "create/role",
        icon: 0
    },
    {
        name: "ROW POLICY",
        doc_link: "create/row-policy",
        icon: 0
    },
    {
        name: "QUOTA",
        doc_link: "create/quota",
        icon: 0
    },
    {
        name: "SETTINGS PROFILE",
        doc_link: "create/settings-profile",
        icon: 0
    },
    {
        name: "ALTER",
        doc_link: "alter/",
        icon: 0
    },
    {
        name: "COLUMN",
        doc_link: "alter/column",
        icon: 0
    },
    {
        name: "PARTITION",
        doc_link: "alter/partition",
        icon: 0
    },
    {
        name: "SETTING",
        doc_link: "alter/setting",
        icon: 0
    },
    {
        name: "DELETE",
        doc_link: "alter/delete",
        icon: 0
    },
    {
        name: "UPDATE",
        doc_link: "alter/update",
        icon: 0
    },
    {
        name: "ORDER BY",
        doc_link: "alter/order-by",
        icon: 0
    },
    {
        name: "SAMPLE BY",
        doc_link: "alter/sample-by",
        icon: 0
    },
    {
        name: "INDEX",
        doc_link: "alter/index/",
        icon: 0
    },
    {
        name: "CONSTRAINT",
        doc_link: "alter/constraint",
        icon: 0
    },
    {
        name: "TTL",
        doc_link: "alter/ttl",
        icon: 0
    },
    {
        name: "USER",
        doc_link: "alter/user",
        icon: 0
    },
    {
        name: "QUOTA",
        doc_link: "alter/quota",
        icon: 0
    },
    {
        name: "ROLE",
        doc_link: "alter/role",
        icon: 0
    },
    {
        name: "ROW POLICY",
        doc_link: "alter/row-policy",
        icon: 0
    },
    {
        name: "SETTINGS PROFILE",
        doc_link: "alter/settings-profile",
        icon: 0
    },
    {
        name: "PROJECTION",
        doc_link: "alter/projection",
        icon: 0
    },
    {
        name: "VIEW",
        doc_link: "alter/view",
        icon: 0
    },
    {
        name: "COMMENT",
        doc_link: "alter/comment",
        icon: 0
    },
    {
        name: "SYSTEM",
        doc_link: "system",
        icon: 0
    },
    {
        name: "SHOW",
        doc_link: "show",
        icon: 0
    },
    {
        name: "GRANT",
        doc_link: "grant",
        icon: 0
    },
    {
        name: "EXPLAIN",
        doc_link: "explain",
        icon: 0
    },
    {
        name: "REVOKE",
        doc_link: "revoke",
        icon: 0
    },
    {
        name: "ATTACH",
        doc_link: "attach",
        icon: 0
    },
    {
        name: "CHECK",
        doc_link: "check-table",
        icon: 0
    },
    {
        name: "DESCRIBE",
        doc_link: "describe-table",
        icon: 0
    },
    {
        name: "DETACH",
        doc_link: "detach",
        icon: 0
    },
    {
        name: "DROP",
        doc_link: "drop",
        icon: 0
    },
    {
        name: "EXISTS",
        doc_link: "exists",
        icon: 0
    },
    {
        name: "KILL",
        doc_link: "kill",
        icon: 0
    },
    {
        name: "OPTIMIZE",
        doc_link: "optimize",
        icon: 0
    },
    {
        name: "RENAME",
        doc_link: "rename",
        icon: 0
    },
    {
        name: "EXCHANGE",
        doc_link: "exchange",
        icon: 0
    },
    {
        name: "SET",
        doc_link: "set",
        icon: 0
    },
    {
        name: "SET ROLE",
        doc_link: "set-role",
        icon: 0
    },
    {
        name: "TRUNCATE",
        doc_link: "truncate",
        icon: 0
    },
    {
        name: "USE",
        doc_link: "use",
        icon: 0
    },
    {
        name: "WATCH",
        doc_link: "watch",
        icon: 0
    },
    {
        name: "ATTACH",
        doc_link: "attach",
        icon: 0
    }, {
        name: "CHECK TABLE",
        doc_link: "check-table",
        icon: 0
    }, {
        name: "DESCRIBE TABLE",
        doc_link: "describe-table",
        icon: 0
    }, {
        name: "DETACH",
        doc_link: "detach",
        icon: 0
    }, {
        name: "DROP",
        doc_link: "drop",
        icon: 0
    }, {
        name: "EXISTS",
        doc_link: "exists",
        icon: 0
    }, {
        name: "KILL",
        doc_link: "kill",
        icon: 0
    }, {
        name: "OPTIMIZE",
        doc_link: "optimize",
        icon: 0
    }, {
        name: "RENAME",
        doc_link: "rename",
        icon: 0
    }, {
        name: "SET",
        doc_link: "set",
        icon: 0
    }, {
        name: "SET ROLE",
        doc_link: "set-role",
        icon: 0
    }, {
        name: "TRUNCATE",
        doc_link: "truncate",
        icon: 0
    }, {
        name: "USE",
        doc_link: "use",
        icon: 0
    }
];
