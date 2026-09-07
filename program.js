let start_folders = [];
let start_folder_handles = [];

const loadingBar = document.querySelector(".bar")
const loadingBarHolder = document.querySelector(".bar-holder")
const startButton = document.querySelector(".startButton");
const statusText = document.querySelector(".statusText");


loadingBarHolder.hidden = true;


async function getCurrentFolders(folder) {


    start_folders = [];
    start_folder_handles = [];

    for await (const [name, handle] of folder.entries()) {
        if (handle.kind === "directory") {
            start_folders.push(name);
            start_folder_handles.push(handle);
        }
    }

}

async function sortF(folder) {
    statusText.hidden = false;
    startButton.hidden = true;
    loadingBarHolder.hidden = false;

    let all_files = []

    // Get folders then make the missing ones

    getCurrentFolders(folder);

    for await (const [name, handle] of folder.entries()) {
        if (handle.kind === "file") {
            file_extension = name.split(".")[1]
            if (!start_folders.includes(file_extension)) {
                await folder.getDirectoryHandle(file_extension, { create: true });
            }
            all_files.push(handle.name)
        }

    }


    // Sort

    getCurrentFolders(folder);



    const files_amount = all_files.length - start_folders.length;

    for await (const [name, handle] of folder.entries()) {
        if (handle.kind === "file") {
            let dot_list_length = name.split(".").length
            file_extension = name.split(".")[dot_list_length - 1]
            const file = await handle.getFile();
            const contents = await file.arrayBuffer();
            if (start_folders.includes(file_extension)) {
                let newFile = await start_folder_handles[start_folders.indexOf(file_extension)].getFileHandle(handle.name, { create: true })

                const writable = await newFile.createWritable();
                await writable.write(contents);
                await writable.close();
                await handle.remove();
                statusText.innerHTML = 'Sorted file ' + handle.name
            }

        }
        let percentage = (all_files.indexOf(handle.name) / files_amount) * 100 + "%"
        loadingBar.style.width = percentage;
        console.log(percentage)

    }




    console.log("\n Available folders: " + start_folders)
    console.log("\n" + start_folder_handles)
    loadingBarHolder.hidden = true;
    startButton.hidden = false;
    loadingBar.style.width = "0%";
    statusText.hidden = true;
}




document.addEventListener("mousemove", (event) => {

});



startButton.addEventListener("click", async () => {
    const folder = await window.showDirectoryPicker();
    sortF(folder);
});


document.addEventListener("keydown", (event) => {
    if (event.key === "]") {
        console.log("a")
    }
})

