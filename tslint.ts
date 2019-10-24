module.exports = {
    "extends": "tslint-config-airbnb",
    "rules": {
        "max-line-length": [true, 160],
        "quotemark": [true, "double"],
        "ter-indent": [true, 4, { "SwitchCase": 1 }],
        "prefer-template": [false],
        "trailing-comma": [
            true,
            {
                "multiline": {
                    "objects": "always",
                    "arrays": "always",
                    "functions": "never",
                    "typeLiterals": "ignore"
                },
                "esSpecCompliant": true
            }
        ]
    }
};
