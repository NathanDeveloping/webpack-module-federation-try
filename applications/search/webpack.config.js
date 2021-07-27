const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const DashboardPlugin = require("@module-federation/dashboard-plugin");

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://nathanw.intdw.org:8081/",
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devServer: {
    host: 'nathanw.intdw.org',
    port: 8081,
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
      name: "search",
      filename: "remoteEntry.js",
      remotes: {
        checkout: "checkout@http://nathanw.intdw.org:8082/remoteEntry.js",
        search: "search@http://nathanw.intdw.org:8081/remoteEntry.js",
        home: "home@http://nathanw.intdw.org:8080/remoteEntry.js",
      },
      exposes: {
        "./Search": "./src/SearchContent",
        "./products": "./src/products",
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
      },
    }),
    // new DashboardPlugin({
    //   dashboardURL: "http://nathanw.intdw.org:3000/api/update",
    //   metadata: {
    //     source: {
    //       url: "http://github.com",
    //     },
    //     remote: "http://nathanw.intdw.org:8082/remoteEntry.js",
    //   },
    // }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
