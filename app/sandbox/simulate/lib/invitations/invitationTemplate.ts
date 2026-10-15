import type {
  InvitationRole,
  InvitationValidationData,
} from "./invitationValidation";

import { secondaryFamilyMemberInvitationTemplate } from "./templates/secondaryFamilyMemberInvitation";
import { caretakerInvitationTemplate } from "./templates/caretakerInvitation";
import { doctorInvitationTemplate } from "./templates/doctorInvitation";

export interface InvitationTemplateInput {
  inviteeEmail: string;
  role: InvitationRole;
  modules: InvitationValidationData["permittedModules"];
  temporaryPassword: string;
  expiresAt: string;
}

export interface InvitationTemplateResult {
  subject: string;
  body: string;
}

class InvitationTemplate {
  create(input: InvitationTemplateInput): InvitationTemplateResult {
    const template = this.getTemplate(input.role);

    const permittedAccess = input.modules
      .map(
        (module) =>
          `- ${this.getModuleLabel(module.module)} — ${this.getPermissionLabel(
            module.permittedPermission
          )}`
      )
      .join("\n");

    const replacements: Record<string, string> = {
      "{{invitee_email}}": input.inviteeEmail,
      "{{carevr_url}}": "https://www.carevr.in",
      "{{role}}": this.getRoleLabel(input.role),
      "{{permitted_access}}": permittedAccess,
      "{{temporary_password}}": input.temporaryPassword,
      "{{expires_at}}": input.expiresAt,
    };

    return {
      subject: this.replacePlaceholders(template.subject, replacements),
      body: this.replacePlaceholders(template.body, replacements),
    };
  }

  private getTemplate(role: InvitationRole) {
    switch (role) {
      case "SECONDARY_FAMILY_MEMBER":
        return secondaryFamilyMemberInvitationTemplate;

      case "CARETAKER":
        return caretakerInvitationTemplate;

      case "DOCTOR":
        return doctorInvitationTemplate;
    }
  }

  private replacePlaceholders(
    content: string,
    replacements: Record<string, string>
  ): string {
    return Object.entries(replacements).reduce(
      (result, [placeholder, value]) =>
        result.replaceAll(placeholder, value),
      content
    );
  }

  private getRoleLabel(role: InvitationRole): string {
    switch (role) {
      case "SECONDARY_FAMILY_MEMBER":
        return "Secondary Family Member";

      case "CARETAKER":
        return "Caretaker";

      case "DOCTOR":
        return "Doctor";
    }
  }

  private getModuleLabel(module: string): string {
    switch (module) {
      case "RECORD_HEALTH":
        return "Record Health";

      case "ASSESSMENT":
        return "Assessment";

      case "CARE_JOURNEY":
        return "Care Journey";

      case "HEALTH_TIMELINE":
        return "Health Timeline";

      case "DOCTOR_NOTES":
        return "Doctor Notes";

      default:
        return module;
    }
  }

  private getPermissionLabel(
    permission: "VIEW" | "CONTRIBUTE" | "ADMIN"
  ): string {
    switch (permission) {
      case "VIEW":
        return "View";

      case "CONTRIBUTE":
        return "Contribute";

      case "ADMIN":
        return "Admin";
    }
  }
}

export const invitationTemplate = new InvitationTemplate();