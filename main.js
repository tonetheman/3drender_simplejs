

class Vec3 {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vec3(this.x + v.x,
            this.y + v.y,
            this.z + v.z);
    }

    subtract(v) {
        return new Vec3(this.x-v.x,
            this.y-v.y,
            this.z-v.z);
    }

    multiply(v) {
        return new Vec3(this.x * v,
            this.y*v,
            this.z*v);
    }

    magnitude() {
        return Math.sqrt(this.x*this.x +
            this.y*this.y +
            this.z*this.z);
    }

    distance(v) {
        let diffX = this.x - v.x;
        let diffY = this.y - v.y;
        let diffZ = this.z - v.z;
        return Math.sqrt(diffX*diffX+diffY*diffY+diffZ*diffZ);
    }

}

class Face {
    constructor(v) {
        this.vertices = v;
    }
    getVertices() {
        return this.vertices;
    }
}

class Mesh {
    constructor(f) {
        this.faces = f;
    }
    getFaces() {
        return this.faces;
    }
}

function makeFace(v1,v2,v3,v4) {
    let pointsInFace = [];
    pointsInFace.push(v1);
    pointsInFace.push(v2);
    pointsInFace.push(v3);
    pointsInFace.push(v4);
}

function createCube(center,size) {
    let left = center.x - size.x * 0.5;
    let right = center.x + size.x * 0.5;
    let bottom = center.y - size.y * 0.5;
    let top = center.y + size.y * 0.5;
    let front = center.z - size.z * 0.5;
    let back = center.z + size.z * 0.5;
    let points = [];
    points.push(new Vec3(left,bottom,front));
    points.push(new Vec3(left,bottom,back));
    points.push(new Vec3(right,bottom,back));
    points.push(new Vec3(right,bottom,front));
    points.push(new Vec3(left,top,front));
    points.push(new Vec3(left,top,back));
    points.push(new Vec3(right,top,back));
    points.push(new Vec3(right,top,front));
    let faces = [];
    faces.push(makeFace(points[0],points[1]));
    faces.push(makeFace(points[4],points[5]));
    faces.push(makeFace(points[0],points[1]));
    faces.push(makeFace(points[3],points[2]));
    faces.push(makeFace(points[1],points[2]));
    faces.push(makeFace(points[0],points[3]));
    return new Mesh(faces);
}

class Plane {
    constructor(point,normal) {
        this.point = point;
        this.normal = normal;
    }
}

Vec3.prototype.dotProduct = function(rhs) {
    return this.x * rhs.x + 
    this.y * rhs.y + this.z*rhs.z;
}

Plane.prototype.rayIntersection = function(rayStart,
    rayDirection ) {
    let interval = this.point.subtract(rayStart)
        .dotProduct(this.normal) / 
        rayDirection.dotProduct(this.normal);
    return rayStart.add(rayDirection.multiply(interval));
}

function projectOnto(eye,face,palm) {
    let projectedVertices = [];
    for(let i=0;i<face.vertices.length;i++) {
        let faceVertext = face.vertices[i];
        let direction = faceVertext.subtract(eye).normalize();
        projectedVertices.push(plane.rayIntersection(eye,direction));
    }
    return new Face(projectedVertices);
}

Vec3.prototype.crossProduct = function(rhs) {
    return new Vec3(
        this.y * rhs.z - this.z * rhs.y,
        this.z * rhs.x - this.x * rhs.z,
        this.x * rhs.y - this.y * rhs.x
    );
}

function Camera(position, pointOfInterest, size) {
    this.position = position;
    this.poi = pointOfInterest;
    this.size = size;

    var lookDirection = pointOfInterest.subtract(position).normalize();
    this.camRight = lookDirection.crossProduct(new Vec3(0, 1.0, 0)).normalize();
    this.camUp = lookDirection.crossProduct(this.camRight).normalize();

    var h = this.camRight.multiply(size);
    var v = this.camUp.multiply(size);
    this.viewCorners = [
        pointOfInterest.subtract(h).subtract(v),
        pointOfInterest.subtract(h).add(v),
        pointOfInterest.add(h).add(v),
        pointOfInterest.add(h).subtract(v)
    ];

    this.horizontalMag = this.viewCorners[3].subtract(this.viewCorners[0]).magnitude();
    this.verticalMag = this.viewCorners[1].subtract(this.viewCorners[0]).magnitude();

    this.plane = makePlaneFromTriangle(this.viewCorners[0], this.viewCorners[1], this.viewCorners[2]);
}

class ScreenBuffer {
    constructor(canvasId) {
        console.log(document.getElementById(canvasId));
        this.canvas = document.getElementById(canvasId);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = this.canvas.getContext('2d');
    
        this.buffer = this.ctx.getImageData(0, 0, this.width, this.height);
        this.pixels = this.buffer.data;    
    }
}

ScreenBuffer.prototype.setPixel = function(pixel, rgb) {
    var idx = (Math.round(pixel.y) * this.width + Math.round(pixel.x)) * 4;
    this.pixels[idx + 0] = rgb.r;
    this.pixels[idx + 1] = rgb.g;
    this.pixels[idx + 2] = rgb.b;
    this.pixels[idx + 3] = 255;
}

ScreenBuffer.prototype.draw = function() {
    this.ctx.putImageData(this.buffer, 0, 0);
}
ScreenBuffer.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.buffer = this.ctx.getImageData(0, 0, this.width, this.height);
    this.pixels = this.buffer.data;
}


function main() {
    console.log("main is running");
    let screen = new ScreenBuffer("c");
}


window.onload = main;