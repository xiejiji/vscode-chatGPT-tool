import { Configuration, OpenAIApi } from "openai";
import type { CreateImageRequest } from "openai";
const configuration = new Configuration({
  apiKey: "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",
});

class ChatGPTApi {
  static instance: ChatGPTApi = new ChatGPTApi();
  private openAi: OpenAIApi = new OpenAIApi(configuration);
  private constructor() {}
  // 获取可以使用的配额引擎
  async getEngines() {
    const {
      data: { data },
    } = await this.openAi.listEngines();
    return data;
  }
  async retrieveEngine(id: string) {
    const { data: data } = await this.openAi.retrieveEngine(id);

    return data;
  }
  async createImage(params: CreateImageRequest) {
    const {
      data: { data },
    } = await this.openAi.createImage({ ...params });
    return data;
  }
}
export default ChatGPTApi.instance;
