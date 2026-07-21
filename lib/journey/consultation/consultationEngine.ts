import { ConsultationMapper } from "./consultationMapper";
import { ConsultationResolver } from "./consultationResolver";
import {
  ConsultationEngineResult,
  ConsultationResolutionRequest,
} from "./consultationTypes";
import { ConsultationValidator } from "./consultationValidator";

export class ConsultationEngine {
  private readonly validator: ConsultationValidator;
  private readonly resolver: ConsultationResolver;
  private readonly mapper: ConsultationMapper;

  constructor() {
    this.validator = new ConsultationValidator();
    this.resolver = new ConsultationResolver();
    this.mapper = new ConsultationMapper();
  }

  process(
    request: ConsultationResolutionRequest
  ): ConsultationEngineResult {

    const validation = this.validator.validate(request);

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors.map(
          error => error.message
        )
      };
    }

    const resolution =
      this.resolver.resolve(request);

    this.mapper.map(resolution);

    return {
      success: true,
      result: resolution,
      errors: []
    };
  }

  validate(
    request: ConsultationResolutionRequest
  ) {
    return this.validator.validate(request);
  }

  resolve(
    request: ConsultationResolutionRequest
  ) {
    return this.resolver.resolve(request);
  }

  map(
    request: ConsultationResolutionRequest
  ) {
    const resolution =
      this.resolver.resolve(request);

    return this.mapper.map(resolution);
  }
}

export const consultationEngine =
  new ConsultationEngine();