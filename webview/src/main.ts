import { createApp } from "vue";
import ElementPlus from "element-plus";
import "./style/index.scss";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";
const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
