const schedule = require('node-schedule')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require('express');
const app = express();
const repo = "C:/Users/anujk/OneDrive/Desktop/gitfolerr";
process.chdir(repo);
app.use(express.json())


// const pushToGitHub = async (branchname) => {
//   const { stdout } = await exec('git status --porcelain');
//   if (stdout.trim() === '') {
//     console.log("no changes to commit:")
//     return;
//   }
//   console.log(process.cwd())
//   await exec('git add .');
//   console.log("added successfully");
//   await exec('git commit -m "done"');
//   console.log("commited successfully ")
//   await exec(`git push origin ${branchname}`);
//   console.log('git push successfully')
//   console.log("done")
// }
const mergebranch = async (publishbranch, codebranch, manual) => {
  await createnewbranch(publishbranch)
  const { stdout } = await exec(`git status`);
  if (stdout.includes('Unmerged paths')) {
    await exec(`git checkout --theirs .`)
    await exec('git add .')
    console.log("added file");
    if (stdout.trim() === '') {
      console.log("no changes to commit:")
      return;
    }
    await exec(`git commit -m "sfsf"`);
    console.log("commited ");
  }
  try {
    await exec(`git pull origin ${manual}`);
    console.log(`pulled from ${manual} to ${publishbranch}`)
  } catch (error) {
    if (error.stdout.includes('CONFLICT')) {
      await exec(`git checkout --theirs .`)
      await exec('git add .')
      console.log("added file");
      if (stdout.trim() === '') {
        console.log("no changes to commit:")
        return;
      }
      await exec(`git commit -m "sfsf"`);
      console.log("commited ");
    } else {
      console.log(error)
    }
  }
  await exec(`git push origin ${publishbranch}`)
  console.log(`pushed from ${manual} to ${publishbranch}`)
  try {
    await exec(`git pull origin ${codebranch}`);
    console.log(`pulled from ${codebranch} to ${publishbranch}`)
  } catch (error) {
    if (error.stdout.includes('CONFLICT')) {
      await exec(`git checkout --theirs .`)
      await exec('git add .')
      console.log("added file");
      if (stdout.trim() === '') {
        console.log("no changes to commit:")
        return;
      }
      await exec(`git commit -m "sfsf"`);
      console.log("commited");
    } else {
      console.log(error)
    }
  }
  await exec(`git push origin ${publishbranch}`)
  console.log(`pushed from ${codebranch} to ${publishbranch}`)
  console.log("main branch updated.")
}

const createnewbranch = async (branchname) => {
    try {
      await exec(`git branch ${branchname}`);
      console.log(`branch created name: ${branchname}`)
    } catch (error) {
      if (error.stderr.includes("fatal")) {
        console.log(`already exit branch: ${branchname}`)
      }
  
    }
    await exec(`git checkout ${branchname}`);
    console.log(`switched to branch ${branchname}`)
  }
  app.get("/merge", async (req, res) => {
    const publishbranch = 'fourth';
    const manual = "first";
    const codebranch = "second";
    const branchname = "third";
    // await createnewbranch(branchname)
    await mergebranch(publishbranch, codebranch, manual)
  
    // await mergebranch(publishbranch, codebranch, manual)
    // schedule.scheduleJob('2 18 * * *', async () => {
    //   await mergebranch(publishbranch, codebranch, manual)
    // });
    res.send("done ")
  })
  app.listen(3000, () => {
    console.log("the server is runnning on port 3000")
  })