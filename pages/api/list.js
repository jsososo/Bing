export default (req, res) => {
  const { date = '', count = 12 } = req.query;
  const { imgArr } = global;
  let startIndex = imgArr.findIndex(({ date: d }) => date === `${d}`);
  (startIndex < 0) && (startIndex = imgArr.length-1);
  res.json({
    data: [...imgArr.slice(Math.max(0, startIndex - (count-1)), startIndex + 1)].reverse(),
  })
}