const test = 15

function startTTW(event, baseUrl, projectId, base_builtin_fields) {
    event.preventDefault()
    //alert('Task!')
    console.log(base_builtin_fields)
    let ns = this

    //window.fetch(ns.loadUrl,
    window.fetch(baseUrl + '.json',
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': ns.getCsrfToken()
        },
        // body: JSON.stringify({
        //   //template_id: selectedTemplate.value,
        //   //template_type: templateType
        //   tselector_id: 1
        // })
      })
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        // NOTE: Workaround for GiHub Issue, to prevent overwrite with default template
        // when operator submits new issue form without required field and returns
        // with error message. If flash message #errorExplanation exists, not overwrited.
        // (https://github.com/akiko-pusu/redmine_issue_templates/issues/50)
        if (document.querySelector('#errorExplanation') && document.querySelector('#errorExplanation')[0]) {
          document.querySelector('#errorExplanation')
          return
        }

        // Returned JSON may have the key some named 'global_template' or 'issue_template'
        let parsedData = JSON.parse(data)
        let templateKey = Object.keys(parsedData)[0]
        let obj = parsedData[templateKey]

        //obj.description = (obj.description == null) ? '' : obj.description
        //obj.issue_title = (obj.issue_title == null) ? '' : obj.issue_title

        let issueSubject = document.getElementById('issue_subject')
        let issueDescription = document.getElementById('issue_description')

        this.loadedTemplate = obj

        // if (ns.shouldReplaced === 'true' && (issueDescription.value !== '' || issueSubject.value !== '')) {
        //   if (obj.description !== '' || obj.issue_title !== '') {
        //     let hideConfirmFlag = ns.hideOverwiteConfirm()
        //     if (hideConfirmFlag === false) {
        //       return ns.confirmToReplaceContent(obj)
        //     }
        //   }
        // }
        // ns.replaceTemplateValue(obj)

        // контент готов
      })
  }

  function getCsrfToken() {
    const metas = document.getElementsByTagName('meta')
    for (let meta of metas) {
      if (meta.getAttribute('name') === 'csrf-token') {
        return meta.getAttribute('content')
      }
    }
    return ''
  }