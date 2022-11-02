import { BigNumber } from "@ijstech/eth-wallet";
// import moment from 'moment';

export const formatDate = (date: any, customType?: string) => {
  const formatType = customType || 'DD/MM/YYYY';
  // return moment(date).format(formatType);
}

export const compareDate = (fromDate: any, toDate?: any) => {
  // if (!toDate) {
  //   toDate = moment();
  // }
  // return moment(fromDate).isSameOrBefore(toDate);
}

export const formatNumber = (value: any, decimals?: number) => {
  let val = value;
  const minValue = '0.0000001';
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  if (val != 0 && new BigNumber(val).lt(minValue)) {
    return `<${minValue}`;
  }
  return formatNumberWithSeparators(val, decimals || 4);
};


export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision) {
    let outputStr = '';
    if (value >= 1) {
      outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
    }
    else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }

    if (outputStr.length > 18) {
      outputStr = outputStr.substr(0, 18) + '...'
    }
    return outputStr;
    // let parts = parseFloat(value.toPrecision(precision)).toString().split(".");
    // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // return parts.join(".");
  }
  else {
    return value.toLocaleString('en-US');
    // let parts = value.toString().split(".");
    // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // return parts.join(".");
  }
}

export const limitDecimals = (value: any, decimals: number) => {
  let val = value;
  if (typeof value !== 'string') {
    val = val.toString();
  }
  let chart;
  if (val.includes('.')) {
    chart = '.';
  } else if (val.includes(',')) {
    chart = ',';
  } else {
    return value;
  }
  const parts = val.split(chart);
  let decimalsPart = parts[1];
  if (decimalsPart && decimalsPart.length > decimals) {
    parts[1] = decimalsPart.substr(0, decimals);
  }
  return parts.join(chart);
}

export async function getAPI(url:string, paramsObj?: any): Promise<any> {
  let queries = '';
  if (paramsObj) {
      try {
          queries = new URLSearchParams(paramsObj).toString();
      } catch(err) {
          console.log('err', err)
      }
  }
  let fullURL = url + (queries ? `?${queries}` : '');
  const response = await fetch(fullURL, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
  });
  return response.json();
}

export const toWeiInv = (n: string, unit?: number) => {
  if (new BigNumber(n).eq(0)) return new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'); 
  return new BigNumber('1').shiftedBy((unit || 18)*2).idiv(new BigNumber(n).shiftedBy(unit || 18));
}

export const abbreviateNum = (value: number): string  => {
  let newValue: number = value;
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixIdx = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixIdx++;
  }

  if (suffixIdx >= suffixes.length) {
    return value.toString();
  }
  return formatNumber(newValue, 2) + suffixes[suffixIdx];
}

export const getParamsFromUrl = () => {
  const startIdx = window.location.href.indexOf("?");
  const search = window.location.href.substring(startIdx, window.location.href.length)
  const queryString = search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}