const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      },
      useBuiltIns: "usage"
    }
  ],
  '@babel/preset-react'
]

const plugins = [
  '@babel/plugin-proposal-class-properties',
  [
    "emotion",
    {
      // sourceMap is on by default but source maps are dead code eliminated in production
      "sourceMap": true,
      "autoLabel": process.env.NODE_ENV !== "production",
      "labelFormat": "[local]",
      "cssPropOptimization": true
    }
  ]
]

module.exports = { presets, plugins }

/*
 "babel": {
    "presets": [
      [
        "env",
        {
          "modules": false
        }
      ],
      "stage-0",
      "react"
    ],
    "plugins": [
      "emotion",
      "external-helpers"
    ]
  }
 */
