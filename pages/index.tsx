import fs from 'fs'
import matter from 'gray-matter'
import Article from "../components/Article"
import { postsFileName, postsPath } from "utils/mdxUtils"
import dayjs from 'dayjs'
import readingTime from 'reading-time'
import path from 'path'
type Frontmatter = {
  title: string
  date: string
  description: string
}
interface Post {
  slug: string
  frontmatter: Frontmatter,
  readTime: string
}
interface Iprops {
  posts: Array<Post>
}
export default function Home({ posts }: Iprops) {
  return (
    <div className="w-full h-full">
      <h2 className='title text-lg w-full pt-[30px] text-center'>择善从之，不善改之</h2>
      <section className=' flex flex-col gap-y-[5px] border-t'>
        {
          posts.map(post => (<Article key={post.slug} post={post}/>))
        }
      </section>
    </div>
  )
}

export async function getStaticProps() {
  const data = postsFileName.map(slug => {
    const content = fs.readFileSync(path.join(postsPath, slug), 'utf-8')
    const { data } = matter(content)
    return {
      frontmatter: data,
      slug,
      readTime: readingTime(content).text
    }
  })
  data.sort((pre, nex) => (new Date(nex.frontmatter.date).getTime()) - (new Date(pre.frontmatter.date).getTime()))
  const posts = JSON.parse(JSON.stringify(data)).map((item: Post) => ({
    ...item,
    frontmatter: {
      ...item.frontmatter,
      date: dayjs(item.frontmatter.date).format('YYYY-MM-DD')
    },
  }))
  return {
    props: {
      posts
    }
  }
}