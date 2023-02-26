exports.JSONSchemaDefinition = {
  $id: 'https://usfm.vachanengine.org/schemas/file.json',
  definitions: {
    chapterContent: {
      $id: '#chapterContent',
      if: {
        type: 'object',
        required: ['verseNumber'],
      },
      then: {
        $ref: '#verse',
      },
      else: {
        if: {
          type: 'object',
          required: ['verseText'],
        },
        then: {
          $ref: '#verse',
        },
        else: {
          $ref: '#otherElement',
        },
      },
    },
    verse: {
      $id: '#verse',
      type: 'object',
      properties: {
        verseNumber: { type: 'string' },
        verseText: { type: 'string' },
        contents: {
          type: 'array',
          items: {
            $ref: '#otherElement',
          },
        },
      },
      required: ['verseNumber', 'verseText'],
    },
    otherElement: {
      $id: '#otherElement',
      oneOf: [
        { type: 'string' },
        { type: 'null' },
        {
          type: 'array',
          items: { $ref: '#otherElement' },
        },
        {
          type: 'object',
          patternProperties: {
            '(^[^ ]+$)': '#otherElement',
          },
        },
      ],
    },
  },

  type: 'object',
  properties: {
    book: {
      type: 'object',
      properties: {
        bookCode: {
          type: 'string',
          enum: ['GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV', 'TOB', 'JDT', 'ESG', 'WIS', 'SIR', 'BAR', 'LJE', 'S3Y', 'SUS', 'BEL', '1MA', '2MA', '3MA', '4MA', '1ES', '2ES', 'MAN', 'PS2', 'ODA', 'PSS', 'EZA', '5EZ', '6EZ', 'DAG', 'PS3', '2BA', 'LBA', 'JUB', 'ENO', '1MQ', '2MQ', '3MQ', 'REP', '4BA', 'LAO', 'FRT', 'BAK', 'OTH', 'INT', 'CNC', 'GLO', 'TDX', 'NDX'],
        },
        description: {
          type: 'string',
        },
        meta: {
          type: 'array',
          items: {
            $ref: '#otherElement',
          },
        },
      },
      required: ['bookCode'],
    },
    chapters: {
      type: 'array',
      items: {
        properties: {
          chapterNumber: { type: 'string' },
          contents: {
            type: 'array',
            items: { $ref: '#chapterContent' },
          },
        },
        required: ['chapterNumber', 'contents'],
        additionalProperties: false,
      },
    },
    _messages: {
      type: 'object',
      properties: {
        _warnings: {
          type: 'array',
        },
      },
    },
  },
  required: ['book', 'chapters'],
};
