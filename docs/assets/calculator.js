'use strict';
// 用整数保存小数，避免二进制浮点误差进入费用复算。
const SCALE = 1000000000n;
function decimal(value) {
  const text = String(value).trim();
  if (text.length > 24 || !/^(?:\d+(?:\.\d{0,9})?|\.\d{1,9})$/.test(text)) throw new Error('decimal');
  const [whole = '', fraction = ''] = text.split('.');
  return BigInt(whole || '0') * SCALE + BigInt(fraction.padEnd(9, '0'));
}
function count(value) {
  const text = String(value).trim();
  if (!/^\d{1,13}$/.test(text) || BigInt(text) > 1000000000000n) throw new Error('count');
  return BigInt(text);
}
function formatRatio(numerator, denominator) {
  const precision = 1000000000000n;
  const rounded = (numerator * precision + denominator / 2n) / denominator;
  if (numerator > 0n && rounded === 0n) return '<0.000000000001';
  const whole = rounded / precision;
  const fraction = String(rounded % precision).padStart(12, '0').replace(/0+$/, '');
  return String(whole) + (fraction ? '.' + fraction : '');
}
function estimate(values) {
  if (values.disjoint !== true) throw new Error('overlap');
  if (!['1000', '1000000'].includes(String(values.unit))) throw new Error('unit');
  const unit = BigInt(values.unit);
  const multiplier = decimal(values.multiplier);
  const portions = ['input', 'cache', 'output'].map(key => count(values[key]) * decimal(values[key + 'Rate']));
  const numerator = portions.reduce((a, b) => a + b, 0n);
  return {
    input: formatRatio(portions[0], unit * SCALE),
    cache: formatRatio(portions[1], unit * SCALE),
    output: formatRatio(portions[2], unit * SCALE),
    base: formatRatio(numerator, unit * SCALE),
    total: formatRatio(numerator * multiplier, unit * SCALE * SCALE),
  };
}
if (typeof module !== 'undefined' && module.exports) module.exports = { decimal, count, formatRatio, estimate };

if (typeof document !== 'undefined') {
  const form = document.querySelector('form');
  const result = document.querySelector('#result');
  const error = document.querySelector('#error');
  const english = document.documentElement.lang === 'en';
  const messages = english ? {
    overlap: 'Confirm that uncached input and cached input are separate counts. Check your provider’s usage definitions first.',
    count: 'Token counts must be whole numbers from 0 to 1,000,000,000,000.',
    decimal: 'Complete every rate and the multiplier with a non-negative number, using up to 9 decimal places. Exponents are not accepted.',
    unit: 'Choose a supported billing unit.',
  } : {
    overlap: '请先确认非缓存输入与缓存输入互不重叠，并核对服务商对用量字段的定义。',
    count: 'Token 数须为 0 到 1,000,000,000,000 之间的整数。',
    decimal: '请填写全部单价和倍率，使用非负数，最多保留 9 位小数，不使用指数写法。',
    unit: '请选择支持的计费单位。',
  };
  let latest;
  document.querySelector('#calculate').addEventListener('click', () => form.requestSubmit());
  form.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    values.disjoint = form.elements.disjoint.checked;
    try {
      const calculated = estimate(values);
      for (const [key, value] of Object.entries(calculated)) document.querySelector('[data-result="' + key + '"]').textContent = value;
      document.querySelectorAll('[data-currency]').forEach(element => { element.textContent = values.currency; });
      latest = { tool: 'Xinghuo token cost worksheet', version: 1, inputs: values, estimate: calculated, note: 'User-supplied rates; estimate only, not an invoice or current service price.' };
      result.hidden = false;
      error.textContent = '';
      document.querySelector('#download').disabled = false;
    } catch (problem) {
      latest = undefined;
      result.hidden = true;
      document.querySelector('#download').disabled = true;
      error.textContent = messages[problem.message] || messages.decimal;
    }
  });
  // 修改输入后隐藏旧结果，避免把上一组金额误认为当前估算。
  form.addEventListener('input', () => {
    latest = undefined;
    result.hidden = true;
    error.textContent = '';
    document.querySelector('#download').disabled = true;
    document.querySelector('#sample-note').hidden = true;
  });
  document.querySelector('#sample').addEventListener('click', () => {
    const sample = { input: '1000', cache: '200', output: '100', inputRate: '2', cacheRate: '0.20', outputRate: '8', multiplier: '1.5', unit: '1000000', currency: 'USD' };
    for (const [key, value] of Object.entries(sample)) form.elements[key].value = value;
    form.elements.disjoint.checked = true;
    document.querySelector('#sample-note').hidden = false;
    form.requestSubmit();
  });
  document.querySelector('#download').addEventListener('click', () => {
    if (!latest) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(latest, null, 2) + '\n'], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'token-cost-worksheet.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
