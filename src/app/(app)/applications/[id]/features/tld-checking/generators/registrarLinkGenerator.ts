export const generateRegistrarLinks = (
  domainName: string,
  tldExtension: string,
) => {
  const fullDomain = `${domainName}${tldExtension}`;
  return {
    namecheap: `https://www.namecheap.com/domains/registration/results/?domain=${fullDomain}`,
    godaddy: `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${fullDomain}`,
    porkbun: `https://porkbun.com/checkout/search?q=${fullDomain}`,
    cloudflare: `https://dash.cloudflare.com/sign-up?to=/:account/domains/register`,
    whois: `https://whois.net/whois/${fullDomain}`,
    icann: `https://lookup.icann.org/en/lookup?name=${fullDomain}`,
  };
};
