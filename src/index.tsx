import { Application, JSX, ParameterType } from "typedoc";
import { CookieConsentConfig } from "vanilla-cookieconsent";

const CONFIG_DEFAULT: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "box",
      position: "top center",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    analytics: {
      readOnly: false,
      autoClear: {
        cookies: [
          {
            name: /^(_ga|_gid)/,
          },
        ],
        reloadPage: true,
      },
    },
  },
  language: {
    default: "en",
    autoDetect: "browser",
    translations: {
      en: {
        consentModal: {
          title: "Cookies consent",
          description:
            "We use cookies to ensure you get the best experience on our website.",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage preferences",
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          sections: [
            {
              title: "Analytics Cookies",
              description:
                "Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "_ga",
                    domain: "Google Analytics",
                    description:
                      'Cookie set by <a href="#das">Google Analytics</a>.',
                    expiration: "Expires after 12 days",
                  },
                  {
                    name: "_gid",
                    domain: "Google Analytics",
                    description:
                      'Cookie set by <a href="#das">Google Analytics</a>',
                    expiration: "Session",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

type Options = {
  enabled: boolean;
  showPreferencesBtn: boolean;
  config: CookieConsentConfig;
};

export function load(app: Application) {
  app.options.addDeclaration({
    name: "cookieConsent",
    help: "Enable cookie consent banner",
    type: ParameterType.Object,
    defaultValue: {
      enabled: false,
      showPreferencesBtn: true,
      config: CONFIG_DEFAULT,
    },
  });

  app.renderer.hooks.on("body.end", () => {
    const options = app.options.getValue("cookieConsent") as Options;
    if (!options || !options.enabled) {
      return JSX.createElement(JSX.Fragment, null);
    }
    const opts = JSON.stringify(options.config);
    const script = `
const link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("href", "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.css");
document.head.appendChild(link);

document.documentElement.classList.toggle('cc--darkmode');
${
  options.showPreferencesBtn
    ? `
const button = document.createElement("button");
button.setAttribute("id", "cookie-consent-button");
button.setAttribute("data-cc", "show-preferencesModal");
button.textContent = "Cookie Preferences";
document.querySelector('footer').appendChild(button);
`
    : ""
}

document.addEventListener('DOMContentLoaded', () => {
    CookieConsent.run(${opts})
});
`.trim();
    return JSX.createElement(JSX.Fragment, null, [
      JSX.createElement("script", {
        src: "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js",
        type: "module",
      }),
      JSX.createElement(
        "script",
        { type: "module" },
        JSX.createElement(JSX.Raw, { html: script }),
      ),
    ]);
  });
}
