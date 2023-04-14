<script setup lang="ts">
import { reactive, onMounted } from "vue";
import type { CreateCompletionRequest } from "openai";
import chatgptApi from "./api/chatgpt";
interface PromptItem {
  input: string;
  answer: any;
}
enum ModelEnum {
  "chat" = "聊天模式",
  "images" = "图片模式",
}
enum ImageSizeEnum {
  "256x256",
  "512x512",
  "1024x1024",
}

type CompletionModel =
  | "text-davinci-003"
  | "text-davinci-002"
  | "text-curie-001"
  | "text-babbage-001"
  | "text-ada-001"
  | "davinci"
  | "curie"
  | "babbage"
  | "ada";

type ChatCompletionModel =
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-32k"
  | "gpt-4-32k-0314"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0301";

type EditModel = "text-davinci-edit-001" | "code-davinci-edit-001";
type AudioModel = "whisper-1";
type FineTunesModel = "davinci" | "curie" | "babbage" | "ada";
type EmbeddingModel = "text-embedding-ada-002" | "text-search-ada-doc-001";
type ModerationModel = "text-moderation-stable" | "text-moderation-latest";

interface CompletionParams {}

interface ChatParams {
  model: ChatCompletionModel;
  messages: any[];
  temperature?: number; // 创新采样，值越大，想象力越丰富
  // eslint-disable-next-line @typescript-eslint/naming-convention
  top_p?: number; // 情绪采样，值高的话就乐观
  n?: number; // 结果数量
  stream?: boolean;
  stop?: string | any[]; // 停止词
  // eslint-disable-next-line @typescript-eslint/naming-convention
  max_tokens?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  presence_penalty?: number; // 重复处罚系数
  // eslint-disable-next-line @typescript-eslint/naming-convention
  frequency_penalty?: number; // 频率处罚系数
  // eslint-disable-next-line @typescript-eslint/naming-convention
  logit_bias?: any;
  user?: string;
}

const completions = {
  completion: {
    type: "completion",
    name: "完成",
    models: {
      "text-davinci-003": {
        model: "text-davinci-003",
      },
      "text-davinci-002": {
        model: "text-davinci-002",
      },
      "text-curie-001": {
        model: "text-curie-001",
      },
      "text-babbage-001": {
        model: "text-babbage-001",
      },
      "text-ada-001": {
        model: "text-ada-001",
      },
      davinci: {
        model: "davinci",
      },
      curie: {
        model: "curie",
      },
      babbage: {
        model: "babbage",
      },
      ada: {
        model: "ada",
      },
    },
  },
  chat: {
    type: "chat",
    name: "聊天",
    models: {
      "gpt-4": {
        model: "gpt-4",
      },
      "gpt-4-0314": { model: "gpt-4-0314" },
      "gpt-4-32k": { model: "gpt-4-32k" },
      "gpt-4-32k-0314": { model: "gpt-4-32k-0314" },
      "gpt-3.5-turbo": { model: "gpt-3.5-turbo" },
      "gpt-3.5-turbo-0301": { model: "gpt-3.5-turbo-0301" },
    },
    params: [{}],
  },
  edit: {
    type: "edit",
    name: "编辑",
    models: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "text-davinci-edit-001": {
        model: "text-davinci-edit-001",
      },
      "code-davinci-edit-001": { model: "code-davinci-edit-001" },
    },
  },
  image: {
    type: "image",
    name: "图片",
    operations: {
      get: {
        params: {
          prompt: "",
          n: 1,
          size: ImageSizeEnum[0],
          response_format: "",
          user: "",
        },
      },
      edit: {
        params: {
          image: null,
          mask: 1,
          prompt: "",
          n: 1,
          size: ImageSizeEnum[0],
          response_format: "",
          user: "",
        },
      },
      variation: {
        params: {
          image: null,
          n: 1,
          size: ImageSizeEnum[0],
          response_format: "",
          user: "",
        },
      },
    },
  },
};
const state = reactive<{
  keyword: string;
  chatConfig: any;
  prompts: PromptItem[];
  models: any[];
  form: any;
}>({
  keyword: "",
  chatConfig: null,
  prompts: [],
  models: [],
  form: {
    type: "",
    model: "",
    key: "",
  },
});
const requestQuestion = async () => {
  const answer = await createImage();
  console.log(answer);
  const obj: PromptItem = {
    input: state.keyword,
    answer: answer[0].url,
  };
  state.keyword = "";
  state.prompts.push(obj);
};
const retrieveEngine = async (id) => {
  const data = await chatgptApi.retrieveEngine(id);
  console.log(data);
  return data;
};
onMounted(() => {
  window.addEventListener("message", (event) => {
    const message = event.data; // The JSON data our extension sent
    state.chatConfig = message;
    switch (message.command) {
      case "getConfig":
        break;
    }
  });
});
const getEnginesReq = async () => {
  const data = await chatgptApi.getEngines();
  console.log(data);
  state.models = data;
};
const createImage = async () => {
  return await chatgptApi.createImage({
    prompt: state.keyword,
    n: 2,
    size: "256x256",
  });
};
const handleModelChange = () => {
  const data = retrieveEngine(state.form.model);
  console.log(data);
  console.log(state.form.model);
};
getEnginesReq();
</script>
<template>
  <div class="container">
    <div class="search">
      <el-row :gutter="10">
        <el-col :span="20">
          <el-form :model="state.form">
            <el-form-item>
              <el-input
                :autosize="{ minRows: 1, maxRows: 4 }"
                v-model="state.keyword"
                type="textarea"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="state.form.type">
                <el-radio v-for="(value, key) in ModelEnum" :label="key">{{
                  value
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-form>
            <el-select v-model="state.form.model" @change="handleModelChange">
              <el-option
                :key="item.id"
                v-for="item in state.models"
                :label="item.id"
                :value="item.id"
                >{{ item.id }}</el-option
              >
            </el-select>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="requestQuestion">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="12">
          <ui>
            <li
              class="prompt-item"
              v-for="(item, index) in state.prompts"
              :key="index"
            >
              <div class="prompts-input">提问：{{ item.input }}</div>
              <div class="prompts-input">
                回答： <img :src="item.answer" alt="" />
              </div>
            </li>
          </ui>
        </el-col>
        <el-col :span="12">
          <el-form :form="state.form">
            <el-form-item label="类型">
              <!-- <el-radio-group v-model="state.form.type">
                <el-radio
                  v-for="(value, key) in completions"
                  :label="value.type"
                  >{{ value.name }}</el-radio
                >
              </el-radio-group> -->
              <el-select v-model="state.form.type" placeholder="请选择">
                <el-option
                  v-for="(item, key) in completions"
                  :key="key"
                  :label="item.name"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="模型"
              v-if="completions[state.form.type]?.models"
            >
              <el-select v-model="state.form.model" placeholder="请选择">
                <el-option
                  v-for="(item, key) in completions[state.form.type]?.models"
                  :key="key"
                  :label="key"
                  :value="key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form> </el-form>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="bottom">
      <div class="submit-btn">
        <el-button @click="requestQuestion">提交</el-button>
      </div>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  padding: 20px;
  height: 100%;
  .search {
  }
  .bottom {
    width: 100%;
    position: fixed;
    bottom: 20px;
    border: 1px solid #ccc;
    padding: 6px;
    :deep(.el-textarea) {
      border: none;
      padding-right: 85px;
      textarea {
        border: none;
        box-shadow: none;
      }
    }
    .submit-btn {
      position: absolute;
      right: 20px;
      bottom: 0;
    }
  }
  .content {
    height: calc(100% - 90px);
    overflow: auto;
    .prompt-item {
    }
    .prompts-input {
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}
</style>
