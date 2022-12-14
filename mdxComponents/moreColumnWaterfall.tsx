import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import axios from 'axios'
interface CardData {
    source: string
    description: string
    width: number
    height: number
}
const Card = ({ source, description, width, height }: CardData) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const container = useRef<HTMLImageElement>(null)
    useEffect(() => {
        const ob = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                imgRef.current!.src = imgRef.current?.getAttribute('data-src')!
                ob.unobserve(imgRef.current!)
            }
        }, { rootMargin: '100px' })
        ob.observe(imgRef.current!)
        return () => {
            ob.disconnect()
        }
    }, [])
    useLayoutEffect(() => {
        const imgHeight = container.current!.clientWidth / width * height
        imgRef.current!.height = imgHeight
    }, [])
    return (
        <div className="w-full my-1 h-fit" ref={container}>
            <img data-src={source} ref={imgRef} alt="waterfall" className='w-full h-auto my-0' />
            <small className='h-6 text-sm text-center truncate'>{description}</small>
        </div>
    )
}

export default function MoreColumnWaterfall() {
    const column = 5
    const [waterfall, setWaterfall] = useState<Array<Array<CardData>>>(new Array(column).fill(new Array()))
    const fetchData = async () => {
        const { data } = await axios.get('/api/waterfall')
        calculatePosition(data.list)
    }
    const calculatePosition = async (cards: Array<CardData>) => {
        const targets = waterfall.map((list, index) => ({
            height: list.reduce((pre, nex) => pre + nex.height, 0),
            index
        }))
        for (let i = 0; i < cards.length; i++) {
            targets.sort((a, b) => a.height - b.height)
            const index = targets[0].index
            const element = cards[i];
            element.height = 100 / element.width * element.height
            setWaterfall(fall => {
                return fall.map((_, key) => {
                    if (key === index) return [..._, element]
                    return [..._]
                })
            })
            targets[0].height += element.height
        }

    }
    useEffect(() => {
        fetchData()
    },[])
    return (
        <section className="w-full h-[600px] overflow-y-auto">
            <div className="w-full flex px-2.5 gap-y-1 h-fit gap-2.5">
                {
                    waterfall.map((parent, index) => {
                        return (
                            <div className="flex flex-col grow" key={`parent-${index}`}>
                                {
                                    parent.map((card, i) => <Card {...card} key={i} />)
                                }
                            </div>
                        )
                    })
                }

            </div>
        </section>
    )
}
