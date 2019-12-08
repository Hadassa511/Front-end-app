function formatData(data) {
  return parseFloat(Math.ceil(data * 1000) / 1000);
}

module.exports = { formatData };
