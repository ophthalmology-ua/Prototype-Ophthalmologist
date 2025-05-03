import { Upload, File, CheckCircle, X, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const UploadStudy = () => {
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('uploadStudy')}</h1>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">{t('dragAndDrop')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('orClickToUpload')}</p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              {t('selectFiles')}
            </label>
          </div>
        </div>
      </div>

      {/* Upload List */}
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
        {/* Upload Item */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">study-001.dcm</p>
                <p className="text-sm text-gray-500">{t('uploadInProgress')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2 mr-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <button className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Completed Upload */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">study-002.dcm</p>
                <p className="text-sm text-gray-500">{t('uploadComplete')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                {t('view')}
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStudy; 