const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const DashboardPlugin = require("@module-federation/dashboard-plugin");
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const config = require("config");

const deps = require("./package.json").dependencies;
module.exports = {
  entry: {
    polyfill: 'babel-polyfill',
    app: './src/index.js'
  },
  output: {
    publicPath: `http://${config.server.host}:${config.server.port}/`,
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8080,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      remotes: {
        checkout: "checkout@http://[window.checkoutAppUrl]/remoteEntry.js",
        search: "search@http://[window.searchAppUrl]/remoteEntry.js",
        home: "home@http://[window.homeAppUrl]/remoteEntry.js",
      },
      exposes: {
        "./Home": "./src/HomeContent",
        "./Frame": "./src/Frame",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "@tadaweb/react-utils": {
          singleton: true,
          eager: true,
          requiredVersion: deps["@tadaweb/react-utils"],
        },
      },
    }),
    // new DashboardPlugin({
    //   dashboardURL: "http://nathanw.intdw.org:3000/api/update",
    //   metadata: {
    //     source: {
    //       url: "http://github.com",
    //     },
    //     remote: "http://nathanw.intdw.org:8080/remoteEntry.js",
    //   },
    // }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new ExternalTemplateRemotesPlugin(),
  ],
};
