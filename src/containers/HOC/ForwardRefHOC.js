import React, { forwardRef } from 'react';

const ForwardRefHOC = WrappedComponent => forwardRef((props, ref) => {

    return <WrappedComponent {...props} forwardedRef={ref} />

})

export default ForwardRefHOC;

