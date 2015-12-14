var faker=require("faker");


function getZendeskCredentials(){
  return {
   username:  faker.internet.email(),
   token: faker.random.number(),
   subdomain: faker.internet.domainName(),
   main: 'https://ubicall.zendesk.com/api/v2',
   voice: "https://ubicall.zendesk.com/api/v2/channels/voice",
   helpcenter: "https://ubicall.zendesk.com/api/v2/help_center"
 };
   
}

function getCategories(){
  return [
    { id: faker.random.number(),
    url: 'https://ubicall.zendesk.com/api/v2/help_center/en-us/categories/'+ faker.random.number()+'.json',
    html_url: 'https://ubicall.zendesk.com/hc/en-us/categories/'+ faker.random.number(),
    position: 0,
    created_at: '2015-10-25T11:31:39Z',
    updated_at: '2015-11-18T23:57:05Z',
    name: faker.name.prefix(),
    description: faker.lorem.words(),
    locale: 'en-us',
    source_locale: 'en-us',
    outdated: false },
  { id:  faker.random.number(),
    url: 'https://ubicall.zendesk.com/api/v2/help_center/en-us/categories/'+ faker.random.number()+'.json',
    html_url: 'https://ubicall.zendesk.com/hc/en-us/categories/'+ faker.random.number(),
    position: 1,
    created_at: '2015-11-11T14:21:18Z',
    updated_at: '2015-11-18T23:59:02Z',
    name: faker.name.prefix(),
    description: faker.lorem.words(),
    locale: 'en-us',
    source_locale: 'en-us',
    outdated: false },
  { id:  faker.random.number(),
    url: 'https://ubicall.zendesk.com/api/v2/help_center/en-us/categories/'+faker.random.number()+'.json',
    html_url: 'https://ubicall.zendesk.com/hc/en-us/categories/'+faker.random.number(),
    position: 2,
    created_at: '2015-11-11T14:28:48Z',
    updated_at: '2015-11-18T23:57:20Z',
    name: faker.name.prefix(),
    description: faker.lorem.words(),
    locale: 'en-us',
    source_locale: 'en-us',
    outdated: false },
  { id:  faker.random.number(),
    url: 'https://ubicall.zendesk.com/api/v2/help_center/en-us/categories/'+faker.random.number()+'.json',
    html_url: 'https://ubicall.zendesk.com/hc/en-us/categories/'+faker.random.number(),
    position: 3,
    created_at: '2015-10-25T11:26:31Z',
    updated_at: '2015-11-19T18:32:52Z',
    name: faker.name.prefix(),
    description: faker.lorem.words(),
    locale: 'en-us',
    source_locale: 'en-us',
    outdated: false }
  ];
}


module.exports={
  getZendeskCredentials:getZendeskCredentials,
  getCategories:getCategories
}