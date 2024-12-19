import { ChatIcon, UserIcon, TrashIcon, DownloadIcon } from '@heroicons/react/solid'
import { HeartIcon as HeartOutline } from '@heroicons/react/outline'

export default function SinglePost({className, post, likeClicked, commentClicked, deletePostClicked}) {
  const {id, caption, imageUrl:fileUrl, totalComments, totalLikes, type} = post
    console.log(fileUrl)
  return (
    <div className={className + ' outline-1'} style={{width:650}}>

      <div className="flex flex-col space-y-2">

      <div className="flex flex-row items-center space-x-4 cursor-pointer active:opacity-80">
        <UserIcon className='cursor-pointer hover:text-gray-900 active:text-gray-700 h-14 w-14 text-gray-700' />
        <p className="text-lg  hover:underline">username</p>
      </div>

        <p className="text-base">{caption}</p>

        <div className="flex flex-row items-end space-x-4 justify-center">

          <a href={fileUrl} target='_blank'>
            {
              (() => {
                if(type.includes("video")) {
                  return  <video className="rounded" width="430" height="768" src={fileUrl} controls></video>
                }
                if(type.includes("image")) {
                  return  <img className="rounded" width="430" height="768" src={fileUrl} ></img>
                }
              })()
            }
         
          </a>

          

          {/* Actions */}
          <div className='flex flex-col space-y-4'>
            <div className='flex flex-col items-center' onClick={() => likeClicked({id})}>
              <HeartOutline className='cursor-pointer hover:text-gray-900 active:text-gray-700 h-14 w-14 text-gray-700' />
              <p>{totalLikes}</p>
            </div>
            <div className='flex flex-col items-center' onClick={() => commentClicked({id})}>
              <ChatIcon className='cursor-pointer hover:text-gray-900 active:text-gray-700 h-14 w-14 text-gray-700' />
              <p>{totalComments}</p>
            </div>

            <div className='flex flex-col items-center' onClick={() => deletePostClicked({id})}>
              <TrashIcon className='cursor-pointer hover:text-gray-900 active:text-gray-700 h-14 w-14 text-gray-700' />
            </div>

              <a href={fileUrl} target='_blank' className='flex flex-col items-center' download>
                <DownloadIcon className='cursor-pointer hover:text-gray-900 active:text-gray-700 h-14 w-14 text-gray-700'/>
              </a>





          </div>          
        </div>

      </div>
    </div>
  )
}