import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { ResponseData } from "@modular-forms/qwik";
import {
  formAction$,
  useForm,
  zodForm$,
  type InitialValues,
} from "@modular-forms/qwik";
import clsx from "clsx";
import postmark from "postmark";

const contactSchema = z.object({
  name: z.string().trim(),
  email: z.string().email().trim(),
  message: z.string(),
  "cf-turnstile-response": z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export const useFormLoader = routeLoader$<InitialValues<ContactForm>>(() => ({
  name: "",
  email: "",
  message: "",
  "cf-turnstile-response": undefined,
}));

export const useFormAction = formAction$<
  ContactForm,
  { status: "success" | "error"; message: string }
>(async (values, event) => {
  try {
    const postmarkToken = event.env.get("POSTMARK_SERVER_TOKEN");
    if (!postmarkToken) {
      throw new Error("POSTMARK_SERVER_TOKEN not set");
    }
    // validate the turnstile response
    const token = values["cf-turnstile-response"];
    const ip = event.headers.get("cf-connecting-ip");
    const secret = event.env.get("TURNSTILE_SECRET");

    if (!token || !secret) {
      console.error("Invalid request");
      return {
        status: "error",
        message: "Invalid request",
      };
    }

    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", token);

    if (ip) {
      formData.append("remoteip", ip);
    }

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
      body: formData,
      method: "POST",
    });

    const outcome = await result.json();
    if (outcome.success) {
      const client = new postmark.ServerClient(postmarkToken);

      const response = await client.sendEmail({
        From: values.email,
        To: "contact@rackles.io",
        Subject: "Website Form Submission",
        HtmlBody: `<p>Name: ${values.name}</p><p>Message: ${values.message}</p>`,
        TextBody: `Name: ${values.name}
        Message: ${values.message}`,
        MessageStream: "outbound",
      });

      if (response.ErrorCode) {
        return {
          status: "error",
          message: response.Message,
        };
      }
      return { status: "success", message: response.Message };
    } else {
      throw new Error("Turnstile validation failed:", outcome);
    }
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}, zodForm$(contactSchema));

export default component$(() => {
  const [contactForm, { Form, Field }] = useForm<ContactForm, ResponseData>({
    loader: useFormLoader(),
    validate: zodForm$(contactSchema),
    action: useFormAction(),
  });

  return (
    <div class="prose mx-auto">
      <h1>Contact John</h1>
      <p>
        If you want to get in contact, you can send me an{" "}
        <a href="mailto:contact@rackles.io">E-Mail</a> or use the form below
      </p>
      {contactForm.response.status === "success" ? (
        <>
          <h2>Form submitted successfully!</h2>
          <p>I will get back to you shortly.</p>
        </>
      ) : (
        <Form class="mt-4 flex flex-col rounded-lg bg-neutral p-4 md:mt-16 md:p-8 lg:mt-24">
          <Field name="name">
            {(field, props) => (
              <div class="form-control mb-4 w-full">
                <label for="name" class="label">
                  <span class="label-text">Name:</span>
                </label>
                <input
                  {...props}
                  id="name"
                  type="text"
                  value={field.value}
                  class="input-bordered input w-full"
                />
                {field.error && (
                  <div class="mt-2 text-sm text-error">{field.error}</div>
                )}
              </div>
            )}
          </Field>
          <Field name="email">
            {(field, props) => (
              <div class="form-control mb-4 w-full">
                <label for="email" class="label">
                  <span class="label-text">E-Mail:</span>
                </label>
                <input
                  {...props}
                  id="email"
                  type="email"
                  value={field.value}
                  class={clsx(
                    "input-bordered input w-full",
                    field.error && "input-error"
                  )}
                />
                {field.error && (
                  <div class="mt-2 text-sm text-error">{field.error}</div>
                )}
              </div>
            )}
          </Field>
          <Field name="message">
            {(field, props) => (
              <div class="form-control mb-4 w-full">
                <label for="message" class="label">
                  <span class="label-text">Message:</span>
                </label>
                <textarea
                  {...props}
                  id="message"
                  value={field.value}
                  class="textarea-bordered textarea h-24"
                />
                {field.error && (
                  <div class="mt-2 text-sm text-error">{field.error}</div>
                )}
              </div>
            )}
          </Field>
          <script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
          ></script>
          <div
            class="cf-turnstile"
            data-sitekey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY}
            data-appearance="interaction-only"
          ></div>
          <button
            type="submit"
            class={clsx(
              "btn-primary btn ml-auto mt-4",
              contactForm.submitting && "loading btn-square"
            )}
          >
            {contactForm.submitting ? "" : "Submit"}
          </button>
        </Form>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "rackles.io | Contact",
  meta: [
    {
      name: "description",
      content: "Contact John Rackles",
    },
  ],
};
