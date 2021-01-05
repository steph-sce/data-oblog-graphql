const CategoryDataSource = require('./categoryDatasource');
const PostDataSource = require('./postDataSource');

module.exports = {
  category: new CategoryDataSource(),
  post: new PostDataSource()
}