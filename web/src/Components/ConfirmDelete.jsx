import React from 'react';

function ConfirmDelete(props) {
    return (
        <div className="flex justify-center items-center p-5">
            <div className="text-center">
                <p className="mb-4 text-gray-700">Are you sure you want to delete this product?</p>
                <button
                    className="bg-orange-500 text-white px-4 py-2 mx-2 rounded hover:bg-orange-600"
                    onClick={props.onConfirm}
                >
                    Confirm
                </button>
                <button
                    className="bg-gray-300 text-black px-4 py-2 mx-2 rounded hover:bg-gray-400"
                    onClick={props.onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default ConfirmDelete;