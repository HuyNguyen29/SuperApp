import * as React from "react";
import { AppRegistry, Text, Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ChunkManager } from "@callstack/repack/client";

ChunkManager.configure({
  forceRemoteChunkResolution: true,
  resolveRemoteChunk: async (chunkId, parentId) => {
    let url;
    switch (parentId) {
      case "app1":
        console.log(`%c chunkId`, chunkId);
        if (
          chunkId ===
          "vendors-node_modules_react-native_Libraries_Core_Devtools_getDevServer_js-node_modules_react--9ff795"
        ) {
          url =
            "https://drive.google.com/u/0/uc?id=1qhGQoHBnW9YUoAubzP8UCp04VYcxhKpf&export=download";
        }
        if (
          chunkId ===
          "vendors-node_modules_react-native_Libraries_NewAppScreen_index_js"
        ) {
          url =
            "https://drive.google.com/u/0/uc?id=1qlA2RO_EvxQgMpfqOdRziE_gvzrWzVuE&export=download";
        }
        if (chunkId === "src_App_js") {
          url =
            "https://drive.google.com/u/0/uc?id=1T1GA-TQXpTIMe6UCyqVPcwBTC4IF-c9_&export=download";
        }
        break;

        break;
      case "main":
      default:
        url =
          "https://drive.google.com/u/0/uc?id=1PEVrQoITG65xvG62aX1ieLx7yBudIXC9&export=download";
        break;
    }
    console.log(`%c url`, url);
    return {
      url: `${url}?platform=${Platform.OS}`,
      excludeExtension: true,
    };
  },
});

async function loadComponent(scope, module) {
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__("default");
  // Download and execute container
  await ChunkManager.loadChunk(scope, "main");

  const container = self[scope];

  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(module);
  const exports = factory();
  return exports;
}

const App1 = React.lazy(() => loadComponent("app1", "./App.js"));

function App1Wrapper() {
  return (
    <React.Suspense
      fallback={<Text style={{ textAlign: "center" }}>Loading...</Text>}
    >
      <App1 />
    </React.Suspense>
  );
}

const Tab = createBottomTabNavigator();

export function Root() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="App1">
        <Tab.Screen name="App1" component={App1Wrapper} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
