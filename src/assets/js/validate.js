/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  return str.trim().length >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 电话号码验证*/
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
  return reg.test(str)
}

/* 居民名称和身份证号*/ 
export function validatIdCard(str){
  const reg=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
  return reg.test(str);
}

/* 15/18位身份证号 */
export function validateCard(str) {
  const reg=/(^\d{15}$)|(^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$)/;
  return reg.test(str);
}

/* 7-8或11位电话号码格式 */
export function validateTel(str) {
  const reg1=/^1[3|4|5|7|8|9][0-9]\d{8}$/;
  const reg2=/^0\d{2,3}-?\d{7,8}$/;
  return reg1.test(str)||reg2.test(str);
}

/* 非负整数且不为0 */
export function validateNumberInt(str) {
  const reg=/^([1-9][0-9]*)$/;
  return reg.test(str);
}

/* 非负整数 */
export function validateNumber(str) {
  const reg=/^(0|[1-9][0-9]*)$/;
  return reg.test(str);
}

/* 非负的整数和小数，最多两位小数 */
export function validateNumberOne(str) {
  const reg=/^(([1-9][0-9]*|0)\.([0-9]{1,2})$)|^([1-9][0-9]*|0)$/;
  return reg.test(str);
}

/* 非负的整数和小数，最多一位小数 */
export function validateNumberFloat(str) {
  const reg=/^(([1-9][0-9]*|0)\.([0-9]{1})$)|^([1-9][0-9]*|0)$/;
  return reg.test(str);
}

/* 字母和数字*/
export function validateLetters(str) {
  const reg=/^[A-Za-z0-9]+$/;
  return reg.test(str);
}

/* 数字*/
export function validateDigital(str) {
  const reg=/^[0-9]+$/;
  return reg.test(str);
}