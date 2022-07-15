const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const AutoReloadPlugin = require("./webpack-plugins/auto-reload.plugin");

module.exports = {
  devtool: "inline-source-map",
  watch: true,
  mode: 'development',
  entry: {
    './background': './src/background/index.ts',
    './content': './src/content/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
              insert: function insertAtTop(element) {
                const inject = () => {
                  document.getElementById('hack-style')?.remove();
                  element.id = 'hack-style';
                  const parent = document.querySelector("head");
                  parent.insertBefore(element, parent.firstChild);
                };
                if (document.readyState === 'complete') {
                  inject();
                } else {
                  document.addEventListener('readystatechange', () => {
                    if (document.readyState === 'complete') {
                      inject();
                    }
                  });
                }
              },
            }
          },
          {
            loader: "css-loader",
            options: {
              exportType: 'array',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
      ],
    }),
    new AutoReloadPlugin({port: 8497})
  ],
};
