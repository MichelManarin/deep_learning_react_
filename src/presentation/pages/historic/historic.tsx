import React, { useState, useEffect } from 'react'
import { GetHistoric } from '@/domain/usecases'

type Props = {
  getHistoric: GetHistoric
}

const Historic: React.FC<Props> = ({ getHistoric }: Props) => {
  const [form, setForm] = useState<any>({
    data: [],
    errorMessage: ''
  })

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await getHistoric.get()
        setForm(response)
      } catch (error) {
        setForm({ errorMessage: 'Something wrong, try later' })
      }
    }
    void fetchData()
  })

  const columnHeaders = [
    'User Input ID',
    'Name video',
    'Confidence',
    'Iou',
    'Frame',
    'Class'
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                {columnHeaders.map((columnName, index) => (
                    <th key={index} scope="col" className={`py-3.5 ${index === 0 ? 'pl-4' : 'px-4'} text-left text-sm font-semibold text-gray-900 ${index === columnHeaders.length - 1 ? 'pr-4' : ''}`}>
                      {columnName}
                    </th>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {form?.data?.map((data: any) => (
                  <tr key={data.id} className="divide-x divide-gray-200">
                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                      {data.id}
                    </td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{data.video_path}</td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{data.confidence}</td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{data.iou}</td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{data.number_fps}</td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{data.class_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Historic
