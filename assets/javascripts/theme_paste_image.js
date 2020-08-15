'use strict'
function startTPI(options = {}){

    if (document.getElementById('cbp_image_fields') == undefined) return
    // pasted image
    let optionsTPI = options
    let pastedImage
    let issueDescription = document.getElementById('issue_description')
    
    // Add the paste event listener
    issueDescription.addEventListener("paste", pasteHandler, false)

    function pasteHandler(e) {
        let clipboardData
        //let pastedData

        clipboardData = e.clipboardData || window.clipboardData
        let items = clipboardData.items
        if (!items) return
        //alert('Empty!')//alert(cbImagePaste.cbp_txt_empty_cb)
        else {
            // Loop through all items, looking for any kind of image
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    event.stopPropagation()
                    event.preventDefault()
                    // We need to represent the image as a file,
                    let blob = items[i].getAsFile()
                    // and use a URL or webkitURL (whichever is available to the browser)
                    // to create a temporary URL to the object
                    let URLObj = window.URL || window.webkitURL
                    let source = URLObj.createObjectURL(blob)
        
                    // The URL can then be used as the source of an image
                    createImage(source)
                return
                }
            }
            //alert('No Image!') //alert(cbImagePaste.cbp_txt_no_image_cb)
        }
    }

    // Creates a new image from a given source
    function createImage(source) {
        pastedImage = new Image()
        pastedImage.onload = function() {
            let dst = document.createElement("canvas")
            dst.width  = pastedImage.width
            dst.height = pastedImage.height
            let ctx = dst.getContext("2d")
            ctx.drawImage(pastedImage, 0, 0)
            let sImg =  dst.toDataURL("image/png")
            let name = insertAttachment(sImg)
            //let id = name.split('picture').join('')
            //id = id.split('.png').join('')
            //let description = document.getElementById('cbp_picture-description' + id)
            //description = description.value || 'картинка'
            //let text = '{{collapse('+ description + ')\n!' + name + '!\n}}'
            let text = '{{collapse(Картинка)\n!' + name + '!\n}}'
            insertText(issueDescription, text)
            //alert('OnLoad!')
        }

        pastedImage.src = source
        
        //alert('Image!')
    }

    //****************************************************************************
    //
    // Redmine stuff
    //
    //****************************************************************************

    // image attachment id offset
    // see attachment_patch.rb
    let imageAttachIdOfs = 10000

    // image field counter
    let imageAttachCount = 0

    //----------------------------------------------------------------------------
    // Insert attachment input tag into document.
    function insertAttachment(rawImg) {
        if (!pastedImage) {
            alert(optionsTPI.cbp_txt_no_image_pst)
        return
        }

        let fields = checkAttachFields()
        if (!fields)
        return false

        //let dataUrl = getImageUrl()
        let dataUrl = rawImg

        if (dataUrl.length > optionsTPI.cbp_max_attach_size){ //5242880) 
            alert(optionsTPI.cbp_txt_too_big_image)
        return
        }

        // inspired by redmine/public/javascripts/application.js
        imageAttachCount++

        // generate "unique" identifier, using "random" part cbImagePaste.cbp_act_update_id
        let attachId    = generateID() + "-" + imageAttachCount
        let attachInpId = "attachments[" + (imageAttachIdOfs + imageAttachCount) + "]"
        
        let s = document.createElement('span') //clone()
        
        s.style.display = "block"
        s.setAttribute('id', 'cbp_image_field')

        let f = document.createElement('span')
        f.setAttribute('id', 'cbp_attach_thumbnail_box')
        let img = document.createElement('img')
        img.setAttribute('id', 'cbp_attach_thumbnail')
        img.setAttribute('src', dataUrl)
        f.appendChild(img)

        s.appendChild(f)

        dataUrl = dataUrl.substring(dataUrl.indexOf("iVBOR"))
        let elHiddenInput = document.createElement('input')
        elHiddenInput.setAttribute('id', 'cbp_image_data')
        elHiddenInput.setAttribute('type', 'hidden')
        elHiddenInput.setAttribute('name', attachInpId + "[data]")
        elHiddenInput.setAttribute('value', dataUrl)
        s.appendChild(elHiddenInput)

        //<input type="text" name="attachments[10001][name]" value="picture885-1.png" class="name" maxlength="50">
        let elInput = document.createElement('input')
        elInput.setAttribute('type', 'text')
        elInput.setAttribute('name',  attachInpId + "[name]")
        let pictureName = "picture" + attachId + ".png"
        elInput.setAttribute('value', pictureName)
        elInput.setAttribute('class', 'name')
        elInput.setAttribute('maxlength', '50')
        s.appendChild(elInput)

        //<a title="Ссылка на изображение и превью" id="cbp_link_btn" href="#"><img src="/redmine/images/link.png" alt="Link"></a>
        let elA = document.createElement('a')
        elA.setAttribute('id', 'cbp_link_btn')
        elA.setAttribute('href', '#')
        elA.setAttribute('onclick', "showCopyLink($(this), $(this).prev()); return false;")
        elA.setAttribute('title', "Ссылка на изображение и превью")

        let elImg = document.createElement('img')
        elImg.setAttribute('src', '/redmine/images/link.png')
        elImg.setAttribute('alt', "Link")
        elA.appendChild(elImg)
        s.appendChild(elA)

        // <input type="text" name="attachments[10001][description]" value="" class="description" maxlength="255" placeholder="Описание (необязательно)">
        elInput = document.createElement('input')
        elInput.setAttribute('type', 'text')
        elInput.setAttribute('name',  attachInpId + "[description]")
        elInput.setAttribute('id', 'cbp_picture-description' + attachId)
        elInput.setAttribute('class', 'description')
        elInput.setAttribute('maxlength', "255")
        elInput.setAttribute('placeholder', "Описание (необязательно)")
        s.appendChild(elInput)

        //<%= link_to_function(image_tag('delete.png'), 'cbImagePaste.removeImageField(this)', :title => (l(:button_delete))) %>
        //<a href="#" onclick="cbImagePaste.removeImageField(this); return false;" title="Удалить"><img src="/redmine/images/delete.png" alt="Delete"></a>

        elA = document.createElement('a')
        elA.setAttribute('href', '#')
        elA.setAttribute('onclick', "cbImagePaste.removeImageField(this); return false;")
        elA.setAttribute('title', "Удалить")

        elImg = document.createElement('img')
        elImg.setAttribute('src', '/redmine/images/delete.png')
        elImg.setAttribute('alt', "Delete")
        elA.appendChild(elImg)
        s.appendChild(elA)

        //console.log(s.outerHTML)
        fields.append(s)
        return pictureName
    }

    //----------------------------------------------------------------------------
    // Check maximum number of attachment fields, return fields element.
    function checkAttachFields() {
        let fileFields  = document.querySelector('#attachments_fields')
        let imageFields = document.querySelector('#cbp_image_fields')
        if (!fileFields || !imageFields ||
        (fileFields.children.length + imageFields.children.length) >= optionsTPI.cbp_max_attachments)
        return
        return imageFields
    }
}

function insertText( txtarea, text ) {

    let start = txtarea.selectionStart
    let end = txtarea.selectionEnd
    let finText = txtarea.value.substring(0, start) + text + txtarea.value.substring(end)
    txtarea.value = finText
    txtarea.focus()
    txtarea.selectionEnd = ( start == end )? (end + text.length) : end 
}

function generateID(){
    return '-' + Math.random().toString(36).substr(2, 9)
}
