import { JourneyPipeline } from "./JourneyPipeline";

export class JourneyPipelineRegistry {
  private static pipeline: JourneyPipeline | null = null;

  private constructor() {}

  static getPipeline(): JourneyPipeline {
    if (!this.pipeline) {
      this.pipeline = new JourneyPipeline();
    }

    return this.pipeline;
  }
}