# typedoc-cookie-consent plugin

This plugin adds a cookie consent to the generated documentation powered by https://cookieconsent.orestbida.com, 
allowing users to accept or decline cookies used by the documentation site.

## Installation

```sh
npm install --save-dev @vpalmisano/typedoc-cookie-consent
```

## Options
Example usage with the [typedoc-plugin-ga plugin](https://github.com/euberdeveloper/typedoc-plugin-ga):

```
"typedocOptions": {
  "plugin": [
    "typedoc-plugin-ga",
    "@vpalmisano/typedoc-cookie-consent"
  ],
  "gaID": "UA-XXXXXXXXX-X",
  "gaCookieConsentCategory": "analytics",
  "cookieConsent": {
    "enabled": true,
    "showPreferencesBtn": true,
    "config": {
      // A valid cookie consent configuration (https://cookieconsent.orestbida.com/reference/configuration-reference.html)
    }
  }
}
```
