const listOfSubmittedData = [];

const uploadDFileata = data => {
    let isDone = false;
    let outputData;
    fetch('/api/<%= team_id %>/submit/<%= task.id %>', {
        method : 'POST',
        body : data
    })
    .then(res => res.json())
    .then(data => {
        isDone = true;
        outputData = data
    })
    .catch(err => console.log(err));
    const uploadNotif = document.getElementById('upload-notification');
    uploadNotif.style.display = 'block';
    if(isDone){
        uploadNotif.style.borderColor = 'green';
        uploadNotif.style.color = 'green';
        uploadNotif.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            Upload Done
        `;
        return outputData;
    }
}

document.getElementById('file-submition').addEventListener('change', async(e) => {
    const userFile = document.getElementById('file-submition').files;
        for(let i = 0; i < userFile.length; i++){
            const dataWak = new FormData();
            const file = userFile[i];
            dataWak.append('task-file', file, file.name);
            
            const data = await uploadDFileata(dataWak);
            listOfSubmittedData.push(data)
            const uploadedFileContainer = document.getElementById('uploaded-file');

            for(let file of listOfSubmittedData){
                let skipThis = false;
                for(let child of uploadedFileContainer.children){
                    if(child.getAttribute('data') == file.path){
                        skipThis = true;
                        break;
                    }
                }
                if(skipThis){
                    continue;
                }
                const element = document.createElement('div');
                element.className = 'file-display';
                element.setAttribute('class', 'file-display');
                element.setAttribute('data', file.path)
                element.innerHTML += `
                    <i class="far fa-file" id="file-type"></i>
                `;
                const name = file.fileName
                const type = `${file['content-type'].split('/').join(" ")} File`
                element.innerHTML += `
                <div class="file-data">
                    <a>${name}</a>
                    <span style="">${type}</span>
                </div>
                <i class="fas fa-x" class="delete-file"></i>
                `;
                uploadedFileContainer.appendChild(element);

            }
    }
})