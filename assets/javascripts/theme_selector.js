function startTTW(event, baseUrl, projectId = 1, isTemplatesEnabled = true, apiKey = '', base_builtin_fields) {

    event.preventDefault()
    let ns = this
    // redmine description field limitation
    const maxlength = 255

    /*
    //Если нужен REST API:

    window.fetch(baseUrl + '.json',
      {
        method: 'POST',
        credentials: 'same-origin',
        //mode: "no-cors",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': ns.getCsrfToken(),
          'X-Redmine-API-Key': apiKey
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

        if (document.querySelector('#errorExplanation') && document.querySelector('#errorExplanation')[0]) {
          document.querySelector('#errorExplanation')
          return
        }
        */
        // Returned JSON may have the key some named 'global_template' or 'issue_template'

        // Заглушка Rest API fetch JSON
        let data = base_builtin_fields

        if (data === undefined || data.length == 0){
            UIkit.notification("Ошибка полуения списка категорий", {status: 'warning', timeout: 1000})
            return
        }

        // Заглушка Rest API fetch JSON
        let parsedData = base_builtin_fields
        // Вернуть при снятии заглушки Rest
        //let parsedData = JSON.parse(data)

        let templateKey = Object.keys(parsedData)[0]
        let loadedSelector = parsedData[templateKey]

        templateKey = Object.keys(parsedData)[1]
        let loadedTemplates = parsedData[templateKey]

        templateKey = Object.keys(parsedData)[2]
        let loadedTrackers = parsedData[templateKey]


        let issueSubject = document.getElementById('issue_subject')
        let issueDescription = document.getElementById('issue_description')
        let issueDTrackerId = document.getElementById('issue_tracker_id')

        // Parsing Subject
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

        // Content ready
        let strTextarea = strClearTheme

        let tmplm = ''
        let isLoadedSelector = false
        let subSelect = []

        if (Array.isArray(loadedSelector) && loadedSelector.length !=0){

            // Prepare view subject selectors

            let elSelect = '<select class="uk-select" id="ttw-selector-category">'
            let elSelected = ''
            let elSubSelected = ''
            let elSelectedId = -1
            loadedSelector.forEach(function (selCategory, i) {
            if (selCategory.enabled === true) {
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

            // prepare templates view

            let elSelectedTemplate = ''
            if(isTemplatesEnabled && Array.isArray(loadedTemplates) && loadedTemplates.length !=0){
                elSelectedTemplate = '<select class="uk-select uk-form-width-large" id="ttw-selector-templates">'
                loadedTemplates.forEach(function (selTemplate, i) {
                if (selTemplate.enabled === true) {

                    elSelectedTemplate += '<option value="' + selTemplate.id + '">' + selTemplate.name + '</option>'
                    }
                })
                elSelectedTemplate += '</select>'
            }

            let elSelectedTemplateInfo = elSelectedTemplate.replace("ttw-selector-templates","ttw-selector-templates-info")

            tmplm = `
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <div class="ttw-text">
            <div class="" id="ttw-modal-themazator">
            <h3 class="uk-h4">Темайзор</h3></div>
            <div class="uk-form-stacked">
            <ul uk-tab>
                <li><a href="#">Тема</a></li>
                ${isTemplatesEnabled ? `<li><a href="#">Шаблон</a></li>` : ''} <!--onclick="$ {clickTemplateTab()-->
            </ul>
            <ul class="uk-switcher uk-margin">
                <li>
                    <fieldset class="uk-fieldset" id="ttw-modal-fieldset-theme">
                        <!--<legend class="uk-legend" style="font-size: 1.2rem;">Выберете категорию:</legend>-->
                        <div class="uk-margin">
                        <label class="uk-form-label" for="form-stacked-text">Выберете категорию:</label>
                            ${elSelect}
                        </div>
                            <div class="uk-margin" id="ttw-selector-subcategory">${subCategory[1]}</div>
                        <div class="uk-margin">
                            <label class="uk-form-label" for="form-stacked-text">Текст темы:</label>
                            <div class="uk-form-controls">
                                <textarea class="uk-textarea" rows="3" placeholder="Тема" id="ttw-textarea-theme" value="${strTextarea}" autofocus>${strTextarea}</textarea>
                            </div>
                        </div>
                        ${isTemplatesEnabled ? `
                        <div class="uk-margin">
                            <label class="uk-form-label" for="form-stacked-text">Применить шаблон:</label>
                            <div class="uk-form-controls">
                            <div class="uk-inline checkbox-apply">
                            ${elSelectedTemplate}
                            <span uk-tooltip="title: Применить шаблон к описанию задачи; pos: top-right; delay: 800">
                            <input class="uk-checkbox ttw-checkbox" style="font-size: 1.5rem;" type="checkbox" id="ttw-template-apply">
                            </span>
                            </div>
                            </div>
                        </div>` : ''}
                     </fieldset>
                </li>
                ${isTemplatesEnabled ? `<li>
                    <legend class="uk-legend" style="font-size: 1.2rem;">Выберете шаблон:</legend>
                    <div class="uk-margin">
                        <div class="uk-inline">
                        <button class="uk-form-icon uk-form-icon button-info" uk-icon="icon: info" type="button" id="ttw-template-info-btn"></button>
                        ${elSelectedTemplateInfo}    
                        </div>        
                    </div>
                    <span id="ttw-template-info-tmpl"></span>
                </li>` : ''}
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

        let textarea
        let selector
        let fieldset
        let btnInfo
        //let tooltip
        let selectorTemplateInfo
        let templateInfoContent
        let listenerTextareaPaste
        let listenerTextareaInput
        let listenerSelectorCategory
        let listenerTextareaKeyDown
        let listenerConfirmButton
        let listenerInfoButton
        let listenerSelectorTemplateInfoClick
        let templateApplyChkBox
        let isStopDropDown = false
        let firstClickOnSelect = true

        UIkit.util.ready(function() {
            const modal = UIkit.modal.confirm(tmplm, { labels: { ok: 'Применить', cancel: 'Отмена' }, stack: true, 'bgClose': true })
            const el = modal.dialog.$el
            //const el = modal.$el
            let btnOk = el.getElementsByClassName('uk-button-primary')[0]
            btnOk.disabled = !isValidSummaryString(strClearTheme)



            if (isLoadedSelector){

                textarea = el.querySelector('#ttw-textarea-theme')
                selector = el.querySelector('#ttw-selector-category')
                fieldset = el.querySelector('#ttw-modal-fieldset-theme')
                btnInfo  = el.querySelector('#ttw-template-info-btn')
                templateInfoContent = el.querySelector('#ttw-template-info-tmpl')
                selectorTemplateInfo = el.querySelector('#ttw-selector-templates-info')
                templateApplyChkBox = el.querySelector('#ttw-template-apply')

                // тултип
                //tooltip = UIkit.tooltip(templateApplyChkBox, { title: 'Применить шаблон к описанию задачи', container: '.checkbox-apply', pos: 'top-right' })//.show() //, container: '.checkbox-apply'

                listenerTextareaPaste = function(event) {
                    let clipboardData
                    let pastedData
                    event.stopPropagation()
                    event.preventDefault()
                    clipboardData = e.clipboardData || window.clipboardData
                    pastedData = avoidHTML(clipboardData.getData('Text'))
                    pastedData = pastedData.replace( /[\t\r\n]/g, " " )
                    pastedData = pastedData.slice(0, maxlength - getFieldString(fieldset, loadedSelector).length)
                    if (pastedData.length !=0) textarea.value = pastedData
                }
                
                listenerTextareaInput = function(e) {
                    btnOk.disabled = !isValidSummaryString(textarea.value)
                }

                listenerTextareaKeyDown = function(event) {
                    let key = event.key
                    if (key == 'Home' || key == 'Delete' || key == 'Backspace' || key == 'ArrowLeft' || key == 'ArrowRight'  || key == 'End' || key == 'ArrowUp' || key == 'ArrowDown') return
                    
                    if (textarea.value.length > maxlength - getFieldString(fieldset, loadedSelector).length - 1) {
                    //textarea.value = textarea.value.slice(0, -1)
                    event.preventDefault()
                    event.stopPropagation()
                    }
                }
                
                listenerSelectorCategory = function(event){
                    for (let opt of event.target.children) {
                        if (opt.selected) {
                            let subSelector = subSelect.find(suber => suber[0] == opt.value )
                            document.querySelector('#ttw-selector-subcategory').innerHTML = subSelector[1]
                            break
                        }
                    }
                }

                // Confirm button press (apply changes to redmine)
                listenerConfirmButton = function(event) {
                    if (13 == event.keyCode || event.which == 1 ) {
                        // Apply issue Subject
                        applyChanges(issueSubject, getSummaryString(fieldset , isValidSummaryString(textarea.value) ? textarea.value.trim() : strClearTheme, loadedSelector))
                        if (isTemplatesEnabled && templateApplyChkBox.checked){
                            // Apply templates to issue description and tracker
                            let issue = loadedTemplates.find(tmpl => tmpl.id == selectorTemplateInfo.value )
                            if (issue !== undefined && issue.description !== undefined && issue.description.length != 0){
                                issueDescription.innerHTML = issue.description
                                let tracker = loadedTrackers.find(tmpl => tmpl.id == issue.tracker_id)
                                if (tracker !== undefined && tracker.id !== undefined && tracker.id.length != 0)  issueDTrackerId.value = tracker.id
                            }
                            //console.log('Template')
                        }
                        UIkit.notification("Темазатор применён", {status: 'primary', timeout: 750})
                    }
                }

                listenerSelectorTemplateInfoClick = function(event){
                    // Манипуляция с UikitDrop и Select
                    if (firstClickOnSelect){
                        firstClickOnSelect = !firstClickOnSelect
                        isStopDropDown = false
                        return
                    }
                    isStopDropDown = true
                }

                listenerInfoButton = function(event){
                    event.preventDefault()
                    event.stopPropagation()
                    if (isLoadedSelector){
        
                    
                    let selectedTemplate_id = selectorTemplateInfo.value
                    let tmpl_template = loadedTemplates.find(tmpl => tmpl.id == selectedTemplate_id )
                    let tmpl_tracker = loadedTrackers.find(tmpl => tmpl.id == tmpl_template.tracker_id)
                    tmpl_tracker = tmpl_tracker.name

                    let view_tmpl = `
                    <div class="uk-card uk-card-body uk-card-default" id="ttw-view-tmpl">
                        <div class="uk-margin">
                            <!-- <label class="uk-form-label" for="form-stacked-text">Имя шаблона:</label>-->
                            <h3 class="uk-card-title">${tmpl_template.name}</h3>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label" for="form-stacked-text ">Трекер:</label>
                            <div class="uk-form-control uk-text-primary">
                                ${tmpl_tracker}
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label" for="form-stacked-text">Описание:</label>
                            <div class="uk-form-controls">
                                ${tmpl_template.description}
                            </div>
                        </div>
                    </div>`

                    templateInfoContent.innerHTML = view_tmpl
                    UIkit.drop('#ttw-template-info-tmpl', {mode: 'click', animation: 'uk-animation-slide-top-small', duration: 500}).show()
                    }
                }

                selector.addEventListener('change', listenerSelectorCategory, false)
                textarea.addEventListener('paste',  listenerTextareaPaste, false)
                textarea.addEventListener('input',  listenerTextareaInput, false)
                textarea.addEventListener('keydown', listenerTextareaKeyDown, false)
                btnOk.addEventListener('click', listenerConfirmButton, false)
                isTemplatesEnabled && btnInfo.addEventListener('click', listenerInfoButton, false)
                isTemplatesEnabled && selectorTemplateInfo.addEventListener('click', listenerSelectorTemplateInfoClick, false)

            }
            // Заглушка Promise
            modal.then(function() {
                //console.log('Confirmed.')
            }, function () {
                //console.log('Rejected.')
            })

            function isValidSummaryStringMaxLength(val){
                if(isLoadedSelector && fieldset !== undefined){
                    let hLen = getFieldString(fieldset, loadedSelector).length  + val.length - 1
                    return hLen <= maxlength
                }
                else return val.length >= 10
            }

            function isValidSummaryString(val){
                return isValid(val) && isValidSummaryStringMaxLength(val)
            }

            UIkit.util.on(el, 'hide', function(event) {
                // If is close Modal.Window - dissmis eventListeners
                if (event.target === el && isLoadedSelector){ 
                //component.$destroy(true)
                    try {
                        selector.removeEventListener('change', listenerSelectorCategory, false)
                        textarea.removeEventListener('paste', listenerTextareaPaste, false)
                        textarea.removeEventListener('input',  listenerTextareaInput, false)
                        textarea.removeEventListener('keydown', listenerTextareaKeyDown, false)
                        btnOk.removeEventListener('click', listenerConfirmButton, false)
                        isTemplatesEnabled && btnInfo.removeEventListener('click', listenerInfoButton, false)
                        isTemplatesEnabled && selectorTemplateInfo.removeEventListener('click', listenerSelectorTemplateInfoClick, false)
                    }
                    catch (e){
                        console.log('error - cant remove listeners ' + e)
                    }
                }
            })

            UIkit.util.on(el, 'beforeshow', function(event) {
                //let target = event.target
                if (event.target === templateInfoContent){ 
                    // Это UikitDown? - отменить показ при нажатии на селектор
                    isStopDropDown && event.preventDefault()
                    isStopDropDown = false
                    return
                }
            })
        })
    // Заглушка REST Api
    //})
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

function getFieldString(fieldset, selectors){
    let strTheme = ''
    let el = fieldset.elements
    let v1 = selectors.find(suber => suber.id == el[0].value)
    strTheme += '['+ v1['category'] + ']'
    strTheme += '['+ el[1].value + ']'
    return strTheme
}

function getSummaryString (fieldset, strClearTheme, selectors){
    return getFieldString(fieldset, selectors) + strClearTheme
}

function applyChanges(subject, val){
    subject.value = val
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