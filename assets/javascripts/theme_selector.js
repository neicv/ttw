/* global CKEDITOR, Element, Event */
'use strict'

const TMPL_OVERWRITE = 1
const TMPL_PUTBEGIN  = 2
const TMPL_PUTEND    = 3

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
        let issueTrackerId = document.getElementById('issue_tracker_id')

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
                let elSubSelect = '<select class="uk-select" id="ttw-subcategory">'
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
                    
                    
                    elSubSelected =  selTemplate.tracker_id == issueTrackerId.value ? 'selected' : ''
                    elSelectedTemplate += '<option '+ elSubSelected + ' value="' + selTemplate.id + '">' + selTemplate.name + '</option>'
                    }
                })
                elSelectedTemplate += '</select>'
            }

            let elSelectedTemplateInfo = elSelectedTemplate.replace("ttw-selector-templates","ttw-selector-templates-info")

            // Base Modal Dialog

            tmplm = `
            <div class="ttw-text">
                <div class="uk-modal-body">
                    <button class="uk-modal-close-default" type="button" uk-close></button>
                    <h3 class="uk-h4">Темайзор</h3>
                    <div class="uk-form-stacked">
                        <ul uk-tab>
                            <li><a href="#">Тема</a></li>
                            ${isTemplatesEnabled ? `<li><a href="#">Инфо</a></li>` : ''}
                        </ul>
                        <ul class="uk-switcher uk-margin">
                            <li>
                                <fieldset class="uk-fieldset" id="ttw-modal-fieldset-theme">
                                    ${isTemplatesEnabled ? `
                                    <div class="uk-margin">
                                        <label class="uk-form-label" for="form-stacked-text">Применить шаблон:</label>
                                        <div class="uk-form-controls">
                                        <div class="uk-inline checkbox-apply">
                                        ${elSelectedTemplate}
                                        <span uk-tooltip="title: Если параметр установлен, трекер и описание задачи будет очищены и заменены текстом и трекером из шаблона.; pos: top-right; delay: 500">
                                        <input class="uk-checkbox ttw-checkbox" style="font-size: 1.5rem;" type="checkbox" checked id="ttw-template-apply">
                                        </span>
                                        </div>
                                        </div>
                                    </div>` : ''}
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
                                </fieldset>
                            </li>
                            ${isTemplatesEnabled ? `<li>
                                <!--<legend class="uk-legend" style="font-size: 1.2rem;">Информация:</legend>-->
                                <div class="uk-margin">
                                В текущей версии плагина существует ключевое ограничение - на один трекер назначается один шаблон, 
                                если будет ипользовано более одного шаблона на один трекер, то автоматически подтягивается первый.</br>
                                <p>Применяя шаблон - применяется и трекер</p>
                                </div>

                                <div class="uk-margin">
                                    <div class="uk-inline">
                                    <button class="uk-form-icon uk-form-icon button-info" uk-icon="icon: info" type="button" id="ttw-template-info-btn"></button>
                                    ${elSelectedTemplateInfo}
                                    </div>
                                    <label class="uk-form-label" for="form-stacked-text">(для предпросмотра шаблона кликнете на иконку)</label>
                                </div>
                                <span id="ttw-template-info-tmpl"></span>
                            </li>` : ''}
                        </ul>
                    </div>
                </div>
            
            
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">Отмена</button> <!--$ {labels.ok}-->
                    <button class="uk-button uk-button-primary" id="modal-confirm-btn">Применить</button>
                </div>
            </div>
            `
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
        let selectorTemplate
        let selectorTemplateInfo
        let templateInfoContent
        let listenerTextareaPaste
        let listenerTextareaInput
        let listenerSelectorCategory
        let listenerTextareaKeyDown
        let listenerInfoButton
        let listenerSelectorTemplateInfoClick
        let templateApplyChkBox
        let isStopDropDown = false
        let firstClickOnSelect = true

        UIkit.util.ready(function() {
            //const modal = UIkit.modal.confirm(tmplm, { labels: { ok: 'Применить', cancel: 'Отмена' }, stack: true, 'bgClose': true })
            const modal = UIkit.modal.dialog(tmplm, { stack: true, 'bgClose': true })
            //const el = modal.dialog.$el
            const el = modal.$el
            el.setAttribute('id','ttw-modal')
            
            //let btnOk = el.getElementsByClassName('uk-button-primary')[0]
            //btnOk.setAttribute('id','modal-confirm-btn')

            let btnOk = el.querySelector('#modal-confirm-btn')
            btnOk.disabled = !isValidSummaryString(strClearTheme)



            if (isLoadedSelector){

                textarea = el.querySelector('#ttw-textarea-theme')
                selector = el.querySelector('#ttw-selector-category')
                fieldset = el.querySelector('#ttw-modal-fieldset-theme')
                btnInfo  = el.querySelector('#ttw-template-info-btn')
                templateInfoContent = el.querySelector('#ttw-template-info-tmpl')
                selectorTemplateInfo = el.querySelector('#ttw-selector-templates-info')
                selectorTemplate = el.querySelector('#ttw-selector-templates')
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
                    if (textarea.value !== undefined && textarea.value.length === 1) textarea.value = textarea.value.charAt(0).toUpperCase()
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
                isTemplatesEnabled && btnInfo.addEventListener('click', listenerInfoButton, false)
                isTemplatesEnabled && selectorTemplateInfo.addEventListener('click', listenerSelectorTemplateInfoClick, false)
            }
            // Заглушка Promise
            // modal.then(function() {
            //     //console.log('Confirmed.')
            // }, function () {
            //     //console.log('Rejected.')
            // })

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

             // Confirm button press (apply changes to redmine)
            UIkit.util.on(btnOk, 'click', function (e) {
                e.preventDefault()
                e.stopPropagation()
                e.target.blur()
                console.log('btn!')

                // Apply issue Subject
                applyChanges(issueSubject, getSummaryString(fieldset , isValidSummaryString(textarea.value) ? textarea.value.trim() : strClearTheme, loadedSelector))
                
                // Apply templates to issue description and tracker
                if (isTemplatesEnabled && templateApplyChkBox.checked){
                    
                    if (issueDescription.value !=''){
                        let tmplConfirm = `
                        <div class="ttw-text">
                            <button class="uk-modal-close-default" type="button" uk-close></button>
                            <div class="ttw-text uk-modal-header">
                                <h3 class="uk-h4 uk-text-danger">Предупреждение:<br></h3>
                                Поле "<span class="uk-text-primary">описание</span>" содержит данные!<br>
                            </div>
                            <div class="uk-modal-body">
                                <p>Вы хотите заменить описание и трекер задачи на текст и трекер из шаблона?</p>
                            <form class="uk-form-stacked">
                                <fieldset class="uk-fieldset" id="ttw-madal-confirm-dialog">
                                <div class="uk-margin">
                                    <div class="uk-form-controls">
                                        <label uk-tooltip="title: текст описания будет очищен и заменен текстом из шаблона.; pos: top-right; delay: 1000">
                                        <input class="uk-radio" type="radio" name="radio1" value="${TMPL_OVERWRITE}" checked> Заменить.</label><br>
                                        <label uk-tooltip="title: текст из шаблона будет добавлен в начало описания задачи.; pos: top-right; delay: 1000">
                                        <input class="uk-radio" type="radio" name="radio1" value="${TMPL_PUTBEGIN}"> Вставить сверху.</label><br>
                                        <label uk-tooltip="title: текст из шаблона будет добавлен в конец описания задачи.; pos: top-right; delay: 1000">
                                        <input class="uk-radio" type="radio" name="radio1" value="${TMPL_PUTEND}"> Вставить вниз.</label>
                                    </div>
                                </div>
                                </fieldset>
                            </form>
                            </div>
                            <div class="uk-modal-footer uk-text-right">
                                <button class="uk-button uk-button-danger" id="modalconfirm-button" autofocus>ОК</button>
                                <button class="uk-button uk-button-primary uk-modal-close" type="button">Отмена</button>
                            </div>
                        </div>
                        `
                        
                        const modalConfirm = UIkit.modal.dialog(tmplConfirm, { stack: true, 'bgClose': true })
                        const elconfirm = modalConfirm.$el
                        const btnCnf = elconfirm.querySelector('#modalconfirm-button')
                        btnCnf.addEventListener('click', (e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.target.blur()
                                let form = elconfirm.querySelector('#ttw-madal-confirm-dialog')
                                let typeC = 1
                                if (form.type === 'fieldset'){
                                    for ( let i=0; i<form.elements.length; i++){
                                        if ( form.elements[i].type ==='radio') {
                                            if (form.elements[i].checked) {
                                                typeC = +form.elements[i].value
                                                break
                                            }
                                        }
                                    }
                                    applyDescription(typeC)
                                    UIkit.notification("Темазатор применён", {status: 'primary', timeout: 750})
                                }
                                
                                //destroy modals
                                modalConfirm.hide()
                                modal.hide()
                            },
                        false)
                    }
                    else {
                        applyDescription()
                        modal.hide()
                    }
                }
                UIkit.notification("Темазатор применён", {status: 'primary', timeout: 750})
            })

            function applyDescription(type = TMPL_OVERWRITE){
                console.log('Apply Description.')
                let issue = loadedTemplates.find(tmpl => tmpl.id == selectorTemplate.value )
                if (issue !== undefined && issue.description !== undefined && issue.description.length != 0){
                    switch(type){
                    
                        case TMPL_OVERWRITE:
                            issueDescription.value = issue.description
                            setCkeContent(issue.description)
                        break

                        case TMPL_PUTBEGIN:
                            issueDescription.value = issue.description + issueDescription.value
                            setCkeContent(issue.description + issueDescription.value)
                        break

                        case TMPL_PUTEND:
                            issueDescription.value = issueDescription.value + issue.description
                            setCkeContent(issueDescription.value + issue.description)
                        break

                        default:
                            // do nothing.
                        break
                    }

                    let tracker = loadedTrackers.find(tmpl => tmpl.id == issue.tracker_id)
                    if (tracker !== undefined && tracker.id !== undefined && tracker.id.length != 0) issueTrackerId.value = tracker.id
                }
            }

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
    let el1 
    let el2
    let elements = fieldset.elements
    for ( let i=0; i<elements.length; i++){
        if (elements[i].id === 'ttw-selector-category') el1 = elements[i].value
        if (elements[i].id === 'ttw-subcategory') el2 = elements[i].value
    }
    let v1 = selectors.find(suber => suber.id == el1)
    strTheme += '['+ v1['category'] + ']'
    strTheme += '['+ el2 + ']'
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

function escapeHTML(val) {
    const div = document.createElement('div')
    div.textContent = val
    return div.textContent
}
function unescapeHTML(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.innerHTML
}
function setCkeContent(val){
    try {
        if (CKEDITOR.instances.issue_description) {
        CKEDITOR.instances.issue_description.setData(val)
        }
    } catch (e) {
        // do nothing.
    }
}
