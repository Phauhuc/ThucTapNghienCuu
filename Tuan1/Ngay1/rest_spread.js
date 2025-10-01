
// spread & rest
const nums = [1,2,3];
const nums2 = [...nums, 4]; 
console.log(nums2);

function sum(...values){ // rest
  return values.reduce((s, x) => s + x, 0);
}
console.log(sum(1,2,3,4)); // 10