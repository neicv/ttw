function startTTW(event, baseUrl, projectId) {

    event.preventDefault()
    //let baseUrl = "http://localhost/redmine/ttw_cats/list_themes"
    let ns = this

    window.fetch(baseUrl + '.json',
      {
        method: 'POST',
        credentials: 'same-origin',
        mode: "no-cors",
        headers: {
          'Content-Type': 'application/json',
          //'X-CSRF-Token': ns.getCsrfToken()
          'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({
          //template_id: selectedTemplate.value,
          //template_type: templateType
          tselector_id: 1
        })
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

        if (data === undefined || data.length == 0){
            UIkit.notification("Ошибка полуения списка категорий", {status: 'warning', timeout: 1000})
            return
        }
        let parsedData = JSON.parse(data)

        let templateKey = Object.keys(parsedData)[0]
        let obj = parsedData[templateKey]

        let issueSubject = document.getElementById('issue_subject')
        let issueDescription = document.getElementById('issue_description')

        //this.loadedTemplate = obj
        let loadedSelector = obj

        // ТЕСТ
        /*
        let parsedData =  {"ttw_cats":[
                          {"id":1,"category":"Can you see this","sub_category":["One","Two","Three","Four"]},
                          {"id":2,"category":"Last Us","sub_category":["A live","To Death","Posible exist","Are you seek?"],"enable":true},
                          {"id":3,"category":"Other Type","sub_category":[],"enable":false},
                          {"id":7,"category":"Коробка","sub_category":["Конфигурация"],"enable":true},
                          {"id":6,"category":"Ролевой доступ","sub_category":["Доступ к моделям","Комбинирование ролей","Модель отображения","Модель действий"],"enable":true},
                          {"id":8,"category":"тест","sub_category":["привет","лада"],"enable":true},
                          {"id":5,"category":"Шаблоны","sub_category":[],"enable":true}]}
        
        let string2 = '[Ролевой доступ][Комбинирование ролей ] Создать новые роли в топик'
        */
        let string2 = issueSubject.value

        let tempCategory =''
        let tempSubCategory =''
        let strClearTheme = ''

        if (string2.length !=0) {
          let matches = string2.split('[')
            .filter(function(v){ return v.indexOf(']') > -1})
            .map( function(value) { 
              return value.split(']')[0]
            })

          tempCategory = matches[0] !== undefined ? matches[0] : ''
          tempSubCategory = matches[1] !== undefined ? matches[1] : ''

          tempCategory = tempCategory.trim()
          tempSubCategory = tempSubCategory.trim()

          if (string2.indexOf('[') != -1){
            strClearTheme = string2.slice(0, string2.indexOf('[')) 
            string2 = string2.lastIndexOf(']') != -1 ? string2.slice(string2.lastIndexOf(']') + 1 , string2.length) : ''
            strClearTheme = strClearTheme + string2
          }
          else strClearTheme = string2
          if (strClearTheme != undefined || strClearTheme != '') strClearTheme = strClearTheme.trim()
        }
        console.log(tempCategory, tempSubCategory, strClearTheme)

        // контент готов

        let strTextarea = strClearTheme

        let tmplm = ''
        let isLoadedSelector = false
        let subSelect = []

        if (Array.isArray(loadedSelector) && loadedSelector.length !=0){

            let elSelect = '<select class="uk-select" id="ttw-selector-category">'
            let elSelected = ''
            let elSubSelected = ''
            let elSelectedId = -1
            loadedSelector.forEach(function (selCategory, i) {
                if (selCategory.enable === true || selCategory.enable === undefined) {
                //elSelected =  selCategory.category === tempCategory ? 'selected' : ''
                if (selCategory.category === tempCategory){
                    elSelected = 'selected'
                    elSelectedId = selCategory.id
                }
                else {
                    elSelected = ''
                }
                elSelect += '<option ' + elSelected + ' value="' + selCategory.id + '">' + selCategory.category + '</option>'
                let elSubSelect = '<select class="uk-select">'
                if (selCategory.sub_category.length !=0 && selCategory.sub_category !== undefined) {
                    selCategory.sub_category.forEach(function (selSubCategory, i) {
                    elSubSelected =  selSubCategory === tempSubCategory && elSelectedId != -1 ? 'selected' : ''
                    elSubSelect += '<option '+ elSubSelected + ' value="' + selSubCategory + '">' + selSubCategory + '</option>'
                    })
                }
                else {
                    elSubSelect += '<option value="none">Подкатегория отсутствует</option>'
                }
                elSubSelect += '</select>'
                subSelect.push([selCategory.id, elSubSelect])
                }
            })
            elSelect += '</select>'

            let subCategory = elSelectedId != -1 ? subSelect.find(suber => suber[0] == elSelectedId ) : subSelect[0]
            
            tmplm = `
            <div class="ttw-text">
            <div class="" id="ttw-modal-themazator">
            <h3 class="uk-h4">Темазатор</h3></div>
            <div class="uk-form-stacked">
            <ul uk-tab>
                <li><a href="#">Тема</a></li>
                <li><a href="#">Шаблон</a></li>
            </ul>
            <ul class="uk-switcher uk-margin">
            <li>
                <fieldset class="uk-fieldset" id="ttw-modal-fieldset-theme">
                    <legend class="uk-legend" style="font-size: 1.2rem;">Выберете категорию:</legend>
                    <div class="uk-margin">${elSelect}</div>
                    <div class="uk-margin" id="ttw-selector-subcategory">${subCategory[1]}</div>
                    <div class="uk-margin">
                    <label class="uk-form-label" for="form-stacked-text">Текст темы:</label>
                    <div class="uk-form-controls">
                        <textarea class="uk-textarea" rows="3" placeholder="Тема" id="ttw-textarea-theme" value="${strTextarea}">${strTextarea}</textarea>
                    </div>
                    </div>
                </fieldset>
            </li>
                <li>
                <legend class="uk-legend" style="font-size: 1.2rem;">Выберете шаблон:</legend>
                </li>
            </ul>
            </div>
            </div>`
            
            isLoadedSelector = true
        }
        else {
          tmplm = 
            `<div class="uk-modal-header" id="my-id">
            <h2 class="uk-modal-title">Темазатор</h2></div>
            <div class="uk-modal-body uk-text-danger uk-text-bold">
            Данные не загружены</div>`
        }

        const modal = UIkit.modal.confirm(tmplm, { labels: { ok: 'Применить', cancel: 'Отмена' }, stack: true, 'bgClose': true })
        const el = modal.dialog.$el
        let btnOk = el.getElementsByClassName('uk-button-primary')[0]
        btnOk.disabled = !isValid(strClearTheme)
        //modal.dialog.show()
        modal.then(function() {
                console.log('Confirmed.')
                applyChanges(document.querySelector('#ttw-modal-fieldset-theme') ,issueSubject, isValid(textarea.value) ? textarea.value.trim() : strClearTheme, loadedSelector)
                UIkit.notification("Темазатор применён", {status: 'primary', timeout: 750})
            }, function () {
                console.log('Rejected.')
        })


        isLoadedSelector && document.body.querySelector('#ttw-selector-category').addEventListener('change', event => {
            for (let opt of event.target.children) {
                if (opt.selected) {
                    let subSelector = subSelect.find(suber => suber[0] == opt.value )
                    document.querySelector('#ttw-selector-subcategory').innerHTML = subSelector[1]
                    break
                }
            }
        }, false)

        let textarea = isLoadedSelector && document.body.querySelector('#ttw-textarea-theme')

        textarea.addEventListener('paste', function(e) {
            let clipboardData
            let pastedData
            e.stopPropagation()
            e.preventDefault()
            clipboardData = e.clipboardData || window.clipboardData
            pastedData = avoidHTML(clipboardData.getData('Text'))
            if (pastedData.length !=0) document.querySelector('#ttw-textarea-theme').value = pastedData.replace( /[\t\r\n]/g, " " )
        }, false)

        textarea.addEventListener('input', function() {
            btnOk.disabled = !isValid(textarea.value)
        }, false);
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

function applyChanges(fieldset, subject, strClearTheme, selectors){
    let strTheme = ''
    let el = fieldset.elements
    let v1 = selectors.find(suber => suber.id == el[0].value)
    strTheme += '['+ v1['category'] + ']'
    strTheme += '['+ el[1].value + ']'
    subject.value = strTheme + strClearTheme
    console.log('Apply')
}

function avoidHTML(text){
    if (text.length == 0) return
    text = text.replace(/<style([\s\S]*?)<\/style>/gi, '')
    text = text.replace(/<script([\s\S]*?)<\/script>/gi, '')
    text = text.replace(/<\/div>/ig, '\n')
    text = text.replace(/<\/li>/ig, '\n')
    text = text.replace(/<li>/ig, '  *  ')
    text = text.replace(/<\/ul>/ig, '\n')
    text = text.replace(/<\/p>/ig, '\n')
    text = text.replace(/<br\s*[\/]?>/gi, "\n")
    text = text.replace(/<[^>]+>/ig, '')
    text = text.replace(/&nbsp;/ig, ' ')
    return text
}

function isValid(val){
    return val.length >= 10
}

  