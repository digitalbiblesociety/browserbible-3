var iso2iana = {
  // These are languages for which at least some browsers have hyphenation
  // dictionaries for listed under ISO-639-1 codes for which ISO-639-2 codes
  // are used in Bible modules and other data we process.
  data: {
    "afr": "af",
    "bul": "bg",
    "cat": "ca",
    "cym": "cy",
    "dan": "da",
    "dut": "nl",
    "eng": "en",
    "epo": "eo",
    "est": "et",
    "fin": "fi",
    "fra": "fr",
    "fre": "fr",
    "glg": "gl",
    "grc": "el",
    "grk": "el",
    "heb": "he",
    "hun": "hu",
    "ice": "is",
    "ina": "ia",
    "isl": "is",
    "ita": "it",
    "lat": "la",
    "lit": "lt",
    "mon": "mn",
    "nld": "nl",
    "nno": "nn",
    "nob": "nb",
    "por": "pt",
    "rus": "ru",
    "slv": "sl",
    "spa": "es",
    "swe": "sv",
    "tur": "tr",
    "ukr": "uk",
    "wel": "cy"
  },

  // Return the language code needed for browsers to properly process lang=
  // attributes. If we don't recognize a mapping, just return the original
  convert: function(iso) {
    var iana =  (typeof this.data[iso] === 'undefined') ? iso : this.data[iso];
    return iana;
  }
};

module.exports = iso2iana;
