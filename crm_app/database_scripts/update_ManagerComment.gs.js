function update_ManagerComments(uuid, comment) {
  const updated_json_html = updateManagerCommentQuery(
    uuid, 
    updateCommentsJSON(
      getManagerCommentQuery(uuid), 
      comment
    )
  )

  return {
    uuid: uuid,
    comment: comment,
    updated_json_html: updated_json_html
  }
}

function getManagerCommentQuery(uuid) {
  const projectId = PROJECT_ID
  const query = "SELECT order_manager_comment from `******.main.orders` WHERE uuid=" + ` "${uuid}"`
  const request = {
    query: query,
    useLegacySql: false
  }
  let queryResults = BigQuery.Jobs.query(request, projectId)
  const jobId = queryResults.jobReference.jobId

  let sleepTimeMs = 500
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs)
    sleepTimeMs *= 2
  }
  return BigQuery.Jobs.getQueryResults(projectId, jobId).rows[0].f[0].v
}

function updateCommentsJSON(comment_json, new_comment) {
  if (comment_json == "") return `{"comments":["${new_comment}"]}`
  let comment_object = JSON.parse(comment_json)
  comment_object.comments.push(new_comment)
  return JSON.stringify(comment_object)
}

function updateManagerCommentQuery(uuid, json) {
  runUpdateQuery("UPDATE `******.main.orders` SET order_manager_comment = " + `'${json}'` + " WHERE uuid = "+`"${uuid}"`)
  return parseManagerCommentToHTML(json, uuid)
}
