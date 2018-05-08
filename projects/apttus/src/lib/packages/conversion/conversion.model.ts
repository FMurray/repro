//Currency Configurations
export const locationData: any = [
  {
    name : 'English',
    short : 'eng',
    currency: 'USD',
    base: 'en_US',
    pim : 'en_US',
    normal: 'en-US',
    key : 1
  } as locale,
  {
    name : 'German',
    short : 'deu',
    currency : 'EUR',
    base : 'de',
    pim : 'de',
    normal : 'de',
    key : 2
  } as locale,
  {
    name : 'Chinese',
    short : 'zho',
    currency : 'CNY',
    base : 'zh_CN',
    normal : 'zh-CN',
    pim : 'ZH',
    key: 3
  } as locale
]

export interface locale {
  name : string;
  short : string;
  currency : string;
  base : string;
  normal : string;
  pim : string;
}

export class LOCALE{
  public static DE = getLocale('de');
  public static EN = getLocale('en_US');
  public static ZH = getLocale('zh_CN')
}

export function getLocale(locale: string, field: string = 'base') : locale{
  if(locale.indexOf('-') >= 0)
    locale = locale.substring(0, locale.indexOf('-'));
  let ret = locationData.filter(location => location[field].toLowerCase() == locale.toLowerCase())[0];
  if(ret)
    return ret;
  else
    return locationData[1];
}
