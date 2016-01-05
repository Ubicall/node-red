var when = require("when");
var faker = require("faker"),
  MAX_ZENDESK_CATEGORIES = MAX_ZENDESK_SECTIONS = MAX_ZENDESK_ARTICLES = faker.random.number(5),
  CATEGORIES_IDs = [],
  SECTIONS_IDs = [],
  ARTICLES_IDs = [];
for (var i = 0; i < MAX_ZENDESK_CATEGORIES; i++) {
  CATEGORIES_IDs.push(faker.random.number());
  SECTIONS_IDs.push(faker.random.number());
  ARTICLES_IDs.push(faker.random.number());
};

/**
@return {Object} zendesk credentials
*/
function getZendeskCredentials() {
  return {
    username: faker.internet.email(),
    token: 'XXXXXXXXXXXXXXXXXX',
    subdomain: faker.internet.domainWord(),
    main: faker.internet.url(),
    voice: faker.internet.url(),
    helpcenter: faker.internet.url()
  };
}
/**
@return {Array} knowledgebase array
*/
function fetchKnowledgebase() {
  return [{
    id: faker.random.number(),
    type: 'view-zendesk-help-center',
    wires: [],
    x: 0,
    y: 0,
    z: 0
  }, {
    choices: [
      [Object]
    ],
    id: faker.random.number(),
    outputs: 1,
    name: 'Designer',
    type: 'view-choice',
    wires: [
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    choices: [
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object]
    ],
    id: faker.random.number(),
    outputs: 11,
    name: 'Components',
    type: 'view-choice',
    wires: [
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Submit Zendesk Ticket',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Send Email',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Zendesk Help Center',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Zendesk Ticket',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Schedule Call',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'URL',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Info',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Form',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'StartScreen',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'GridScreen',
    url: faker.internet.url(),
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Choice',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/' + faker.random.number() + '-Choice',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    choices: [
      [Object]
    ],
    id: faker.random.number(),
    outputs: 1,
    name: 'Zendesk Integrations',
    type: 'view-choice',
    wires: [
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    choices: [
      [Object],
      [Object]
    ],
    id: faker.random.number(),
    outputs: 2,
    name: 'Set-up',
    type: 'view-choice',
    wires: [
      [Object],
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'How can I customize the Zendesk Ticket Fields?',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/215754777-How-can-I-customize-the-Zendesk-Ticket-Fields-',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'How do I integrate my Zendesk Ticketing System & Help Center with Ubicall?',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/' + faker.random.number() + '-How-do-I-integrate-my-Zendesk-Ticketing-System-Help-Center-with-Ubicall-',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    choices: [
      [Object]
    ],
    id: faker.random.number(),
    outputs: 1,
    name: 'Admin Dashboard',
    type: 'view-choice',
    wires: [
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    choices: [
      [Object]
    ],
    id: faker.random.number(),
    outputs: 1,
    name: 'First section ',
    type: 'view-choice',
    wires: [
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'first article',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/' + faker.random.number() + '-first-article',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    choices: [
      [Object],
      [Object]
    ],
    id: faker.random.number(),
    outputs: 2,
    name: 'General',
    type: 'view-choice',
    wires: [
      [Object],
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    choices: [
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object]
    ],
    id: faker.random.number(),
    outputs: 6,
    name: 'FAQ',
    type: 'view-choice',
    wires: [
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    choices: [
      [Object],
      [Object]
    ],
    id: faker.random.number(),
    outputs: 2,
    name: 'Announcements',
    type: 'view-choice',
    wires: [
      [Object],
      [Object]
    ],
    x: 0,
    y: 0,
    z: 0
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Will my customer have to download the Ubicall App?',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/' + faker.random.number() + '-Will-my-customer-have-to-download-the-Ubicall-App-',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'What information does Ubicall store on its server?',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/214619567-What-information-does-Ubicall-store-on-its-server-',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'What are these sections and articles doing here?',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/' + faker.random.number() + '-What-are-these-sections-and-articles-doing-here-',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'How do I customize my Help Center?',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/213075907-How-do-I-customize-my-Help-Center-',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'How do I publish my content in other languages?',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/213075917-How-do-I-publish-my-content-in-other-languages-',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Help, I have a question and I need an answer',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/213075927-Help-I-have-a-question-and-I-need-an-answer',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Zendesk is Fully Integrated',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/213075877-Zendesk-is-Fully-Integrated',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    id: faker.random.number(),
    type: 'view-url',
    name: 'Info & URL Screens, No Longer "End-Nodes"',
    url: 'https://' + faker.internet.domainWord() + '.zendesk.com/hc/en-us/articles/213075887-Info-URL-Screens-No-Longer-End-Nodes-',
    x: 0,
    y: 0,
    z: 0,
    wires: []
  }, {
    choices: [
      [Object],
      [Object],
      [Object],
      [Object]
    ],
    id: faker.random.number(),
    outputs: 4,
    name: 'Help Center',
    type: 'view-choice',
    wires: [
      [Object],
      [Object],
      [Object],
      [Object]
    ],
    x: 0,
    y: 0,

  }];
}
/**
 * @return {Array} mocked ticketfields
 */
function fetchTicketsFields() {
  return [{
    "id": faker.random.number(),
    "meta": [{
      "type": "file",
      "value": "Default",
      "key": "Font"
    }, {
      "type": "text",
      "value": "Orange",
      "key": "Theme"
    }],
    "type": "start",
    "wires": [
      [faker.random.number()]
    ],
    "x": faker.random.number(),
    "y": faker.random.number(),
    "z": faker.random.number()
  }, {
    "name": "Internal Infrastructure Analyst",
    "help": "International",
    "id": faker.random.number(),
    "type": "view-zendesk-ticket-form",
    "wires": [
      [faker.random.number()]
    ],
    "x": faker.random.number(),
    "y": faker.random.number(),
    "z": faker.random.number(),
    "fields": [{
      "url": faker.internet.url(),
      "id": 27251038,
      "type": "subject",
      "title": "Subject",
      "raw_title": "Subject",
      "description": "",
      "raw_description": "",
      "position": 1,
      "active": true,
      "required": false,
      "collapsed_for_agents": false,
      "regexp_for_validation": null,
      "title_in_portal": "Subject",
      "raw_title_in_portal": "Subject",
      "visible_in_portal": false,
      "editable_in_portal": false,
      "required_in_portal": false,
      "tag": null,
      "created_at": "2015-08-10T20:49:25Z",
      "updated_at": "2015-12-07T18:59:16Z",
      "removable": false
    }, {
      "url": faker.internet.url(),
      "id": faker.random.number(),
      "type": "description",
      "title": "Description",
      "raw_title": "Description",
      "description": "Please enter the details of your request. A member of our support staff will respond as soon as possible.",
      "raw_description": "Please enter the details of your request. A member of our support staff will respond as soon as possible.",
      "position": 2,
      "active": true,
      "required": false,
      "collapsed_for_agents": false,
      "regexp_for_validation": null,
      "title_in_portal": "Description",
      "raw_title_in_portal": "Description",
      "visible_in_portal": true,
      "editable_in_portal": true,
      "required_in_portal": true,
      "tag": null,
      "created_at": "2015-08-10T20:49:25Z",
      "updated_at": "2015-08-10T20:49:27Z",
      "removable": false
    }, {
      "url": "https://" + faker.internet.domainWord() + ".zendesk.com/api/v2/ticket_fields/" + faker.random.number() + ".json",
      "id": faker.random.number(),
      "type": "status",
      "title": "Status",
      "raw_title": "Status",
      "description": "Request status",
      "raw_description": "Request status",
      "position": 3,
      "active": true,
      "required": false,
      "collapsed_for_agents": false,
      "regexp_for_validation": null,
      "title_in_portal": "Status",
      "raw_title_in_portal": "Status",
      "visible_in_portal": false,
      "editable_in_portal": false,
      "required_in_portal": false,
      "tag": null,
      "created_at": "2015-08-10T20:49:25Z",
      "updated_at": "2015-08-10T20:49:27Z",
      "removable": false,
      "system_field_options": [{
        "name": "Open",
        "value": "open"
      }, {
        "name": "Pending",
        "value": "pending"
      }, {
        "name": "Solved",
        "value": "solved"
      }]
    }, {
      "url": "https://" + faker.internet.domainWord() + ".zendesk.com/api/v2/ticket_fields/" + faker.random.number() + ".json",
      "id": faker.random.number(),
      "type": "tickettype",
      "title": "Type",
      "raw_title": "Type",
      "description": "Request type",
      "raw_description": "Request type",
      "position": 4,
      "active": true,
      "required": false,
      "collapsed_for_agents": false,
      "regexp_for_validation": null,
      "title_in_portal": "Type",
      "raw_title_in_portal": "Type",
      "visible_in_portal": true,
      "editable_in_portal": true,
      "required_in_portal": false,
      "tag": null,
      "created_at": "2015-08-10T20:49:25Z",
      "updated_at": "2015-12-07T19:02:33Z",
      "removable": true,
      "system_field_options": [{
        "name": "Question",
        "value": "question"
      }, {
        "name": "Incident",
        "value": "incident"
      }, {
        "name": "Problem",
        "value": "problem"
      }, {
        "name": "Task",
        "value": "task"
      }]
    }, {
      "url": "https://" + faker.internet.domainWord() + ".zendesk.com/api/v2/ticket_fields/" + faker.random.number() + ".json",
      "id": faker.random.number(),
      "type": "text",
      "title": "Age",
      "raw_title": "Age",
      "description": "your age",
      "raw_description": "your age",
      "position": 9999,
      "active": true,
      "required": false,
      "collapsed_for_agents": false,
      "regexp_for_validation": null,
      "title_in_portal": "Age",
      "raw_title_in_portal": "Age",
      "visible_in_portal": false,
      "editable_in_portal": false,
      "required_in_portal": false,
      "tag": null,
      "created_at": "2015-11-15T10:13:19Z",
      "updated_at": "2015-11-18T20:08:34Z",
      "removable": true
    }, {
      "url": "https://" + faker.internet.domainWord() + ".zendesk.com/api/v2/ticket_fields/" + faker.random.number() + ".json",
      "id": faker.random.number(),
      "type": "tagger",
      "title": "Category",
      "raw_title": "Category",
      "description": "ngjh",
      "raw_description": "ngjh",
      "position": 9999,
      "active": false,
      "required": false,
      "collapsed_for_agents": false,
      "regexp_for_validation": null,
      "title_in_portal": "Category",
      "raw_title_in_portal": "Category",
      "visible_in_portal": true,
      "editable_in_portal": true,
      "required_in_portal": false,
      "tag": null,
      "created_at": "2015-11-16T11:11:05Z",
      "updated_at": "2015-12-07T19:01:46Z",
      "removable": true,
      "custom_field_options": [{
        "id": faker.random.number(),
        "name": "Category1",
        "raw_name": "Category1",
        "value": "category1tag"
      }, {
        "id": faker.random.number(),
        "name": "Category2",
        "raw_name": "Category2",
        "value": "category2tag"
      }, {
        "id": faker.random.number(),
        "name": "Category3",
        "raw_name": "Category3",
        "value": "category3tag"
      }]
    }, {
      "url": "https://" + faker.internet.domainWord() + ".zendesk.com/api/v2/ticket_fields/28946907.json",
      "id": faker.random.number(),
      "type": "date",
      "title": "Birth Date",
      "raw_title": "Birth Date",
      "description": "Birth Date",
      "raw_description": "Birth Date",
      "position": 9999,
      "active": true,
      "required": false,
      "collapsed_for_agents": false,
      "regexp_for_validation": "\\A([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])\\z",
      "title_in_portal": "Birth Date",
      "raw_title_in_portal": "Birth Date",
      "visible_in_portal": true,
      "editable_in_portal": true,
      "required_in_portal": false,
      "tag": null,
      "created_at": "2015-11-16T11:08:05Z",
      "updated_at": "2015-12-07T19:01:37Z",
      "removable": true
    }, {
      "url": "https://" + faker.internet.domainWord() + ".zendesk.com/api/v2/ticket_fields/28446177.json",
      "id": faker.random.number(),
      "type": "text",
      "title": "Market",
      "raw_title": "Market",
      "description": "Please enter your market",
      "raw_description": "Please enter your market",
      "position": 9999,
      "active": true,
      "required": false,
      "collapsed_for_agents": false,
      "regexp_for_validation": null,
      "title_in_portal": "Market",
      "raw_title_in_portal": "Market",
      "visible_in_portal": true,
      "editable_in_portal": true,
      "required_in_portal": true,
      "tag": null,
      "created_at": "2015-10-18T12:11:29Z",
      "updated_at": "2015-11-16T15:34:31Z",
      "removable": true
    }]
  }, {
    "id": faker.random.number(),
    "name": "Osinski",
    "type": "view-zendesk-help-center",
    "choices": [],
    "x": faker.random.number(),
    "y": faker.random.number(),
    "z": faker.random.number(),
    "wires": []
  }, {
    "id": 53964,
    "name": "Mr.",
    "type": "action-submit-zendesk-ticket",
    "choices": [],
    "x": faker.random.number(),
    "y": faker.random.number(),
    "z": faker.random.number(),
    "wires": []
  }, {
    "id": 87,
    "type": "url",
    "url": faker.internet.url(),
    "name": "tommie.info",
    "wires": [
      [faker.random.number()]
    ],
    "x": faker.random.number(),
    "y": faker.random.number(),
    "z": faker.random.number()
  }, {
    "choices": [{
      "text": "Miss",
      "icon": faker.internet.url() + "/uploads/b32ed83fef8be9a9a3d735e752610413.png"
    }, {
      "text": "Mrs.",
      "icon": faker.internet.url() + "/uploads/b32ed83fef8be9a9a3d735e752610413.png"
    }, {
      "text": "Ms.",
      "icon": faker.internet.url() + "/uploads/b32ed83fef8be9a9a3d735e752610413.png"
    }],
    "id": faker.random.number(),
    "outputs": 3,
    "name": "Dynamic Functionality Consultant",
    "type": "view-grid",
    "wires": [
      [faker.random.number()],
      [faker.random.number()],
      [faker.random.number()]
    ],
    "x": faker.random.number(),
    "y": faker.random.number(),
    "z": faker.random.number()
  }, {
    "id": faker.random.number(),
    "name": "",
    "settings": {},
    "type": "view-zopim-chat",
    "wires": [],
    "x": faker.random.number(),
    "y": faker.random.number(),
    "z": faker.random.number()
  }]
}

/**
 * @return {Object} category - zendesk category
 */
function getCategory(domain) {
  var domain = domain || "ubicall";
  var id = faker.random.arrayElement(CATEGORIES_IDs);
  return {
    id: id,
    url: 'https://' + domain + '.zendesk.com/api/v2/help_center/en-us/categories/' + id + '.json',
    html_url: 'https://' + domain + '.zendesk.com/api/v2/help_center/en-us/categories/' + id,
    position: 0,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    name: faker.name.prefix(),
    description: faker.lorem.words(),
    locale: 'en-us',
    source_locale: 'en-us',
    "outdated": faker.random.boolean()
  };
}

/**
 * @return {Array} categories - zendesk help center categories
 */
function getCategories() {
  var defer = when.defer();
  var size = 3;
  var categories = [];
  for (var i = 0; i < size; i++) {
    categories.push(getCategory("ubicall"));
  }
  defer.resolve(categories);
  return defer.promise;
}

/**
 * @return {Object} section - zendesk category's section
 */
function getCategorySection(category_id, domain) {
  var domain = domain || "ubicall";
  var id = faker.random.arrayElement(SECTIONS_IDs);
  return {
    "id": id,
    "url": "https://" + domain + "zendesk.com/api/v2/help_center/en-us/sections/" + id + ".json",
    "html_url": "https://" + domain + "zendesk.com/api/v2/help_center/en-us/sections/" + id,
    "category_id": category_id,
    "position": 0,
    "sorting": "manual",
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    name: faker.name.prefix(),
    description: faker.lorem.words(),
    locale: 'en-us',
    source_locale: 'en-us',
    "outdated": faker.random.boolean(),
    "deleted_at": null
  };
}


/**
 * @return {Array} sections - zendesk helpcenter category sections
 */
function getCategorySections() {
  var defer = when.defer();
  var size = 3;
  var category_id = faker.random.arrayElement(CATEGORIES_IDs);
  var _sections = {
    "sections": [],
    "page": 1,
    "previous_page": null,
    "next_page": null,
    "per_page": 30,
    "page_count": 1,
    "count": 1,
    "sort_by": "position",
    "sort_order": "asc"
  };
  for (var i = 0; i < size; i++) {
    _sections.sections.push(getCategorySection(category_id, "ubicall"));
  }
  defer.resolve(_sections.sections);
  return defer.promise;
}

/**
 * @return {Object} article - zendesk help center article
 */
function getArticle(section_id, domain) {
  var domain = domain || faker.internet.domainWord();
  var id = faker.random.arrayElement(ARTICLES_IDs);
  var author_id = faker.random.number();
  var title = faker.random.name;
  return {
    "id": id,
    "url": "https://" + domain + ".zendesk.com/api/v2/help_center/en-us/articles/" + id + "-" + "title" + ".json",
    "html_url": "https://" + domain + ".zendesk.com/api/v2/help_center/en-us/articles/" + id + "-" + "title",
    "author_id": author_id,
    "comments_disabled": faker.random.boolean(),
    "draft": faker.random.boolean(),
    "promoted": faker.random.boolean(),
    "position": 0,
    "vote_sum": 0,
    "vote_count": 0,
    "section_id": section_id,
    "created_at": faker.date.past(),
    "updated_at": faker.date.recent(),
    "name": title,
    "title": title,
    "body": faker.lorem.words(),
    "source_locale": "en-us",
    "locale": "en-us",
    "outdated": faker.random.boolean(),
  };
}


/**
 * @return {Array} articles - zendesk helpcenter category articles
 */
function getCategoryArticles() {
  var defer = when.defer();
  var size = 3;
  var section_id = faker.random.arrayElement(SECTIONS_IDs);
  var _articles = {
    "articles": [],
    "page": 1,
    "previous_page": null,
    "next_page": null,
    "per_page": 30,
    "page_count": 1,
    "count": 1,
    "sort_by": "position",
    "sort_order": "asc"
  };
  for (var i = 0; i < size; i++) {
    _articles.articles.push(getArticle(section_id, "ubicall"));
  }
  defer.resolve(_articles.articles);
  return defer.promise;
}


/**
 *@return {Array} zendesk knowledgebase
 */
function kb() {
  return [{
    id: faker.random.number(),
    url: faker.internet.url + '/' + faker.random.number() + '.json',
    html_url: faker.internet.url + '/' + faker.random.number(),
    position: 0,
    created_at: '2015-10-25T11:31:39Z',
    updated_at: '2015-12-15T18:22:44Z',
    name: 'Designer',
    description: 'Articles about creating different flows using the Designer.',
    locale: 'en-us',
    source_locale: 'en-us',
    outdated: false,
    sections: [
      [Object]
    ]
  }, {
    id: faker.random.number(),
    url: faker.internet.url + '/' + faker.random.number() + '.json',
    html_url: 'https://ubicall.zendesk.com/hc/en-us/categories/' + faker.random.number(),
    position: 1,
    created_at: '2015-11-11T14:21:18Z',
    updated_at: '2015-12-15T17:33:17Z',
    name: 'Zendesk Integrations',
    description: 'These articles are all related to questions about Zendesk Integration. ',
    locale: 'en-us',
    source_locale: 'en-us',
    outdated: false,
    sections: [
      [Object]
    ]
  }, {
    id: faker.random.number(),
    url: faker.internet.url + '/' + faker.random.number() + '.json',
    html_url: faker.internet.url + '/' + faker.random.number(),
    position: 2,
    created_at: '2015-11-11T14:28:48Z',
    updated_at: '2015-12-15T18:23:52Z',
    name: 'Admin Dashboard',
    description: 'This provides detailed information on the Admin Dashboard.',
    locale: 'en-us',
    source_locale: 'en-us',
    outdated: false,
    sections: [
      [Object]
    ]
  }, {
    id: faker.random.number(),
    url: faker.internet.url + '/' + faker.random.number() + '.json',
    html_url: faker.internet.url + '/' + faker.random.number(),
    position: 3,
    created_at: '2015-10-25T11:26:31Z',
    updated_at: '2015-11-19T18:32:52Z',
    name: 'General',
    description: '',
    locale: 'en-us',
    source_locale: 'en-us',
    outdated: false,
    sections: [
      [Object],
      [Object]
    ]
  }];
}
module.exports = {
  getZendeskCredentials: getZendeskCredentials,
  getCategories: getCategories,
  fetchTicketsFields: fetchTicketsFields,
  fetchKnowledgebase: fetchKnowledgebase,
  kb: kb,
  getCategory: getCategory,
  getCategories: getCategories,
  getCategorySections: getCategorySections,
  getCategoryArticles: getCategoryArticles,
  getSectionArticles: getCategoryArticles
}