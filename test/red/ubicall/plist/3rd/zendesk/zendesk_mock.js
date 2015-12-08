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


module.exports={
  getZendeskCredentials:getZendeskCredentials
}